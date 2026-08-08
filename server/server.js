import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 6000;

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup nodemailer transporter using Gmail helper service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection config
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server connected and ready to send emails');
  }
});

// API endpoint to send emails
app.post('/api/send-email', async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'All fields (name, phone, email) are required.' });
  }

  const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Neat HTML email template matching the Cookscape theme
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Outfit', sans-serif; background-color: #faf9f6; padding: 20px; color: #111; margin: 0; }
      .container { max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #eee; margin: 0 auto; }
      .header { background: #b81c22; padding: 30px; text-align: center; }
      .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 2px; }
      .body-content { padding: 40px; }
      .eyebrow { color: #b81c22; font-weight: 700; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
      .title { font-size: 20px; margin-top: 0; margin-bottom: 25px; font-weight: 600; }
      .details-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
      .details-table td { padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
      .label { font-weight: 600; color: #555; width: 120px; font-size: 14px; }
      .value { color: #111; font-size: 15px; }
      .footer { background: #1a1a1a; color: #888; padding: 20px; text-align: center; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>COOKSCAPE</h1>
      </div>
      <div class="body-content">
        <div class="eyebrow">New Lead Alert</div>
        <h2 class="title">Festive Offer Unlock Registration</h2>
        
        <table class="details-table">
          <tr>
            <td class="label">Client Name</td>
            <td class="value"><strong>${name}</strong></td>
          </tr>
          <tr>
            <td class="label">Mobile Number</td>
            <td class="value"><a href="tel:${phone}" style="color: #b81c22; text-decoration: none; font-weight: 600;">${phone}</a></td>
          </tr>
          <tr>
            <td class="label">Email Address</td>
            <td class="value"><a href="mailto:${email}" style="color: #b81c22; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td class="label">Submitted On</td>
            <td class="value">${currentDate}</td>
          </tr>
        </table>
      </div>
      <div class="footer">
        <p>This lead was captured automatically via the Festive Offer Popup Form.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"Cookscape Web App" <${process.env.SMTP_USER}>`,
    to: 'designs.cookscape@gmail.com',
    subject: `New Lead: ${name} (Festive Offer)`,
    html: htmlTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

// API endpoint to rename images in public directory and update siteData.js
app.post('/api/rename-image', (req, res) => {
  const { oldUrl, newName, category } = req.body;

  if (!oldUrl || !newName || !category) {
    return res.status(400).json({ error: 'Missing required fields (oldUrl, newName, category).' });
  }

  try {
    const publicDir = path.join(__dirname, '../public');
    const oldDiskPath = path.join(publicDir, oldUrl);

    if (!fs.existsSync(oldDiskPath)) {
      return res.status(404).json({ error: `Image file not found on disk at: ${oldUrl}` });
    }

    const ext = path.extname(oldUrl);
    // Convert newName to safe lower-case-kebab filename
    const slugName = newName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special characters
      .trim()
      .replace(/\s+/g, '-'); // replace spaces with dashes
    
    const newFileName = `${slugName}${ext}`;
    const categoryFolder = category; // E.g. "Modular kitchen" or "TV unit"
    
    // Construct new relative URL path
    const newUrl = `/Website-Gallery/${categoryFolder}/${newFileName}`.replace(/\\/g, '/');
    const newDiskPath = path.join(publicDir, newUrl);

    // 1. Rename file physically
    fs.renameSync(oldDiskPath, newDiskPath);
    console.log(`Physically renamed file from ${oldDiskPath} to ${newDiskPath}`);

    // 2. Read and update siteData.js
    const siteDataPath = path.join(__dirname, '../src/data/siteData.js');
    if (fs.existsSync(siteDataPath)) {
      let siteDataContent = fs.readFileSync(siteDataPath, 'utf-8');
      
      // Title format: Capitalized Words
      const newTitle = newName.replace(/\b\w/g, l => l.toUpperCase());

      // Find: "url": "oldUrl",\s*"title": "[^"]*"
      // We must escape any regex characters in oldUrl
      const escapedOldUrl = oldUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      // Update url
      siteDataContent = siteDataContent.replace(
        new RegExp(`"url":\\s*"${escapedOldUrl}"`, 'g'),
        `"url": "${newUrl}"`
      );

      // Update title associated with the new url
      const escapedNewUrl = newUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const titleRegex = new RegExp(`("url":\\s*"${escapedNewUrl}",\\s*"title":\\s*")[^"]*(")`, 'g');
      siteDataContent = siteDataContent.replace(titleRegex, `$1${newTitle}$2`);

      fs.writeFileSync(siteDataPath, siteDataContent, 'utf-8');
      console.log(`Updated siteData.js for ${oldUrl} -> ${newUrl} with title "${newTitle}"`);
    } else {
      console.warn(`siteData.js not found at: ${siteDataPath}`);
    }

    return res.status(200).json({ success: true, newUrl, newTitle: newName });
  } catch (err) {
    console.error('Error during image renaming:', err);
    return res.status(500).json({ error: `Internal error: ${err.message}` });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is running healthy.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
