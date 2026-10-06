import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const cleanPassword = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: cleanPassword,
  },
});

// Verify SMTP connection config on start
transporter.verify((error) => {
  if (error) {
    console.error('SMTP Connection Warning:', error.message);
    console.warn(
      'Please ensure 2-Step Verification is enabled and a valid 16-character App Password is generated for ' +
        (process.env.SMTP_USER || 'your account')
    );
  } else {
    console.log('✓ SMTP Server connected and ready to send emails via ' + (process.env.SMTP_USER || ''));
  }
});

/**
 * Controller to send customer enquiry and lead emails
 */
export const sendEmail = async (req, res) => {
  const { name, phone, email, message, source, location, houseType, bhk } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Name, phone, and email are required.' });
  }

  const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const leadSource = source || 'Website Consultation Form';
  const receiverEmail = process.env.RECEIVER_EMAIL || 'mail.cookscape.leads@gmail.com';

  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f6f2; padding: 25px 15px; color: #1a1a1a; margin: 0; }
      .container { max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border: 1px solid #e8e6df; margin: 0 auto; }
      .header { background: linear-gradient(135deg, #b81c22 0%, #8f1217 100%); padding: 35px 25px; text-align: center; }
      .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; }
      .header p { color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px; letter-spacing: 1px; }
      .body-content { padding: 35px 30px; }
      .eyebrow { color: #b81c22; font-weight: 700; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
      .title { font-size: 22px; margin: 0 0 25px; font-weight: 700; color: #111; }
      .details-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
      .details-table td { padding: 14px 10px; border-bottom: 1px solid #eee; }
      .label { font-weight: 600; color: #666; width: 130px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
      .value { color: #111; font-size: 15px; }
      .project-details { background: #faf9f6; border-left: 4px solid #b81c22; padding: 15px 20px; border-radius: 4px; margin-top: 20px; }
      .project-details-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #b81c22; margin-bottom: 8px; }
      .project-details-text { color: #333; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-line; }
      .footer { background: #1a1a1a; color: #999; padding: 22px 25px; text-align: center; font-size: 12px; line-height: 1.5; }
      .footer a { color: #ff6b6b; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>COOKSCAPE</h1>
        <p>Luxury Home & Kitchen Interiors</p>
      </div>
      <div class="body-content">
        <div class="eyebrow">New Lead Notification</div>
        <h2 class="title">${leadSource}</h2>
        
        <table class="details-table">
          <tr>
            <td class="label">Client Name</td>
            <td class="value"><strong>${name}</strong></td>
          </tr>
          <tr>
            <td class="label">Phone</td>
            <td class="value"><a href="tel:${phone}" style="color: #b81c22; text-decoration: none; font-weight: 700; font-size: 16px;">${phone}</a></td>
          </tr>
          <tr>
            <td class="label">Email</td>
            <td class="value"><a href="mailto:${email}" style="color: #b81c22; text-decoration: none;">${email}</a></td>
          </tr>
          ${location ? `
          <tr>
            <td class="label">Location / City</td>
            <td class="value"><strong>${location}</strong></td>
          </tr>` : ''}
          ${houseType ? `
          <tr>
            <td class="label">Type of House</td>
            <td class="value"><strong>${houseType}</strong></td>
          </tr>` : ''}
          ${bhk ? `
          <tr>
            <td class="label">BHK Requirement</td>
            <td class="value"><strong>${bhk}</strong></td>
          </tr>` : ''}
          <tr>
            <td class="label">Source</td>
            <td class="value">${leadSource}</td>
          </tr>
          <tr>
            <td class="label">Received At</td>
            <td class="value">${currentDate}</td>
          </tr>
        </table>

        ${message ? `
        <div class="project-details">
          <div class="project-details-title">Project Details / Message</div>
          <p class="project-details-text">${message}</p>
        </div>` : ''}
      </div>
      <div class="footer">
        <p>This message was sent from the Cookscape website enquiry system.</p>
        <p>Respond to lead directly via <a href="tel:${phone}">${phone}</a> or <a href="mailto:${email}">${email}</a>.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"Cookscape Enquiries" <${process.env.SMTP_USER || 'webapp.cookscape@gmail.com'}>`,
    to: receiverEmail,
    replyTo: email,
    subject: `New Lead: ${name} (${leadSource})`,
    html: htmlTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Email sent successfully:', info.messageId);
    return res.status(200).json({ success: true, message: 'Your enquiry has been sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: 'Failed to send email via SMTP.',
      details: error.message,
    });
  }
};

/**
 * Health check controller
 */
export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    port: process.env.PORT || 5005,
    smtpUser: process.env.SMTP_USER || null,
    receiverEmail: process.env.RECEIVER_EMAIL || 'mail.cookscape.leads@gmail.com',
  });
};
