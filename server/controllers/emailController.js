import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded whether starting from project root or server directory
const rootEnvPath = path.resolve(__dirname, '../../.env');
const serverEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
}
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

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
  const {
    name,
    phone,
    email,
    message,
    source,
    location,
    city,
    state,
    houseType,
    propertyType,
    propertyStatus,
    bhk,
    interiors,
    budget,
    timeline,
  } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Name, phone, and email are required.' });
  }

  const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const leadSource = source || 'Website Consultation Form';
  const receiverEmail = process.env.RECEIVER_EMAIL || 'mail.cookscape.leads@gmail.com';
  const effectivePropertyType = propertyType || houseType || '';
  const effectiveLocation = location || [city, state].filter(Boolean).join(', ');
  const interiorsList = Array.isArray(interiors) ? interiors.join(', ') : interiors || '';

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
      .label { font-weight: 600; color: #666; width: 150px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
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
          ${effectiveLocation ? `
          <tr>
            <td class="label">Location</td>
            <td class="value"><strong>${effectiveLocation}</strong></td>
          </tr>` : ''}
          ${effectivePropertyType ? `
          <tr>
            <td class="label">Property Type</td>
            <td class="value"><strong>${effectivePropertyType}</strong></td>
          </tr>` : ''}
          ${propertyStatus ? `
          <tr>
            <td class="label">Property Status</td>
            <td class="value"><strong>${propertyStatus}</strong></td>
          </tr>` : ''}
          ${bhk ? `
          <tr>
            <td class="label">BHK Requirement</td>
            <td class="value"><strong>${bhk}</strong></td>
          </tr>` : ''}
          ${interiorsList ? `
          <tr>
            <td class="label">Interiors Needed</td>
            <td class="value"><strong>${interiorsList}</strong></td>
          </tr>` : ''}
          ${budget ? `
          <tr>
            <td class="label">Budget</td>
            <td class="value"><strong>${budget}</strong></td>
          </tr>` : ''}
          ${timeline ? `
          <tr>
            <td class="label">Start Timeline</td>
            <td class="value"><strong>${timeline}</strong></td>
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
 * Controller to handle detailed Get Quote form submissions and send to mail.cookscape.leads@gmail.com
 */
export const sendQuote = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bhk,
      propertyType,
      propertyStatus,
      city,
      state,
      interiors,
      budget,
      timeline,
      source,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        error: 'Full Name, Email Address, and Phone Number are required.',
      });
    }

    const receiverEmail =
      process.env.QUOTE_RECEIVER_EMAIL ||
      process.env.RECEIVER_EMAIL ||
      'mail.cookscape.leads@gmail.com';
    const senderAddress = process.env.SMTP_USER || 'webapp.cookscape@gmail.com';
    const quoteId = `CS-QT-${Math.floor(100000 + Math.random() * 900000)}`;
    const currentDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const selectedInteriors = Array.isArray(interiors)
      ? interiors
      : interiors
      ? [interiors]
      : [];

    const interiorsBadgesHtml =
      selectedInteriors.length > 0
        ? selectedInteriors
            .map(
              (item) =>
                `<span style="display:inline-block;background:#fdf2f2;color:#b81c22;border:1px solid #f5c2c4;padding:6px 12px;border-radius:100px;font-size:13px;font-weight:600;margin:0 6px 6px 0;">&#10003; ${item}</span>`
            )
            .join('')
        : '<span style="color:#666;">Not specified</span>';

    const plainSummary = [
      `COOKSCAPE - GET QUOTE ENQUIRY [${quoteId}]`,
      `Date: ${currentDate}`,
      ``,
      `1. CONTACT DETAILS`,
      `- Full Name: ${name}`,
      `- Email Address: ${email}`,
      `- Phone Number: ${phone}`,
      ``,
      `2. PROPERTY DETAILS`,
      `- How many BHK?: ${bhk || 'Not specified'}`,
      `- Property Type: ${propertyType || 'Not specified'}`,
      `- Property Status: ${propertyStatus || 'Not specified'}`,
      `- City: ${city || 'Not specified'}`,
      `- State: ${state || 'Not specified'}`,
      ``,
      `3. INTERIOR REQUIREMENTS`,
      `- Interiors Needed: ${selectedInteriors.join(', ') || 'Not specified'}`,
      `- Budget: ${budget || 'Not specified'}`,
      `- Expected Project Start Timeline: ${timeline || 'Not specified'}`,
    ].join('\n');

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Quote Request: ${name}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f3ef; padding: 25px 15px; color: #1a1a1a; margin: 0; }
        .wrapper { max-width: 640px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.08); border: 1px solid #e5e2da; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #b81c22 0%, #800f14 100%); padding: 34px 30px; text-align: center; }
        .badge { display: inline-block; background: rgba(255,255,255,0.16); color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 5px 14px; border-radius: 100px; margin-bottom: 10px; }
        .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
        .header p { color: rgba(255,255,255,0.88); margin: 6px 0 0; font-size: 13px; }
        .meta-bar { background: #faf9f6; border-bottom: 1px solid #ebe8e1; padding: 14px 30px; font-size: 12px; color: #666; display: flex; justify-content: space-between; }
        .body-content { padding: 28px 30px 32px; }
        .section-title { font-size: 12px; font-weight: 700; color: #b81c22; text-transform: uppercase; letter-spacing: 1.5px; margin: 22px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #f3f1ec; }
        .section-title:first-child { margin-top: 0; }
        .details-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .details-table td { padding: 11px 8px; border-bottom: 1px solid #f2f0ea; font-size: 14px; vertical-align: top; }
        .label { font-weight: 600; color: #666; width: 170px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; }
        .value { color: #111; font-size: 15px; font-weight: 500; }
        .summary-box { background: #faf9f6; border-left: 4px solid #b81c22; padding: 16px 20px; border-radius: 6px; margin-top: 22px; }
        .summary-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #b81c22; margin-bottom: 8px; }
        .summary-pre { color: #333; font-size: 13px; line-height: 1.55; margin: 0; white-space: pre-line; font-family: monospace; }
        .action-bar { text-align: center; margin-top: 26px; padding-top: 18px; border-top: 1px solid #eee; }
        .btn-primary { display: inline-block; background: #b81c22; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: 700; font-size: 13px; margin: 4px 6px; }
        .btn-dark { display: inline-block; background: #1a1a1a; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: 700; font-size: 13px; margin: 4px 6px; }
        .footer { background: #141414; color: #999; padding: 20px 25px; text-align: center; font-size: 12px; line-height: 1.6; }
        .footer a { color: #ff6b6b; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="badge">NEW QUOTE ENQUIRY</div>
          <h1>COOKSCAPE INTERIORS</h1>
          <p>${bhk || ''} ${propertyType || ''} &bull; ${city || ''}${state ? `, ${state}` : ''}</p>
        </div>
        <div class="meta-bar">
          <span>Reference ID: <strong>${quoteId}</strong> &bull; Received: ${currentDate}</span>
        </div>
        <div class="body-content">
          <div class="section-title">1. Contact Details</div>
          <table class="details-table">
            <tr>
              <td class="label">Full Name</td>
              <td class="value"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td class="value"><a href="mailto:${email}" style="color: #b81c22; text-decoration: none; font-weight: 600;">${email}</a></td>
            </tr>
            <tr>
              <td class="label">Phone Number</td>
              <td class="value"><a href="tel:${phone}" style="color: #b81c22; text-decoration: none; font-weight: 700; font-size: 16px;">${phone}</a></td>
            </tr>
          </table>

          <div class="section-title">2. Property Details</div>
          <table class="details-table">
            <tr>
              <td class="label">How many BHK?</td>
              <td class="value"><strong>${bhk || 'Not specified'}</strong></td>
            </tr>
            <tr>
              <td class="label">Property Type</td>
              <td class="value"><strong>${propertyType || 'Not specified'}</strong></td>
            </tr>
            <tr>
              <td class="label">Property Status</td>
              <td class="value"><strong>${propertyStatus || 'Not specified'}</strong></td>
            </tr>
            <tr>
              <td class="label">City</td>
              <td class="value"><strong>${city || 'Not specified'}</strong></td>
            </tr>
            <tr>
              <td class="label">State</td>
              <td class="value"><strong>${state || 'Not specified'}</strong></td>
            </tr>
          </table>

          <div class="section-title">3. Interior Requirements</div>
          <table class="details-table">
            <tr>
              <td class="label">Interiors Needed</td>
              <td class="value">${interiorsBadgesHtml}</td>
            </tr>
            <tr>
              <td class="label">Budget</td>
              <td class="value"><strong style="color: #b81c22;">${budget || 'Not specified'}</strong></td>
            </tr>
            <tr>
              <td class="label">Project Timeline</td>
              <td class="value"><strong>${timeline || 'Not specified'}</strong></td>
            </tr>
          </table>

          <div class="summary-box">
            <div class="summary-title">Copyable Enquiry Details</div>
            <pre class="summary-pre">${plainSummary}</pre>
          </div>

          <div class="action-bar">
            <a href="tel:${phone}" class="btn-primary">Call ${name} (${phone})</a>
            <a href="mailto:${email}?subject=${encodeURIComponent(`Your Cookscape Interior Quote Request [${quoteId}]`)}" class="btn-dark">Reply via Email</a>
          </div>
        </div>
        <div class="footer">
          <p>Sent from the <strong>${source || 'Cookscape Get Quote Form'}</strong> to <strong>${receiverEmail}</strong>.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Cookscape Quote Desk" <${senderAddress}>`,
      to: receiverEmail,
      replyTo: `${name} <${email}>`,
      subject: `New Quote Enquiry: ${name} - ${bhk || ''} ${propertyType || ''} in ${city || 'India'} [${budget || 'Quote'}]`,
      text: plainSummary,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Quote enquiry email sent to ${receiverEmail} for ${name}: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      quoteId,
      message: 'Your quote enquiry has been sent successfully!',
    });
  } catch (error) {
    console.error('Error sending quote email:', error);
    return res.status(500).json({
      error: 'Failed to send quote enquiry via SMTP.',
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
    quoteReceiverEmail: process.env.QUOTE_RECEIVER_EMAIL || 'mail.cookscape.leads@gmail.com',
    careersEmail: process.env.CAREERS_RECEIVER_EMAIL || 'es.cookscape@gmail.com',
  });
};

/**
 * Controller to handle career / job applications and forward to es.cookscape@gmail.com
 */
export const applyJob = async (req, res) => {
  try {
    const {
      jobTitle,
      name,
      email,
      phone,
      location,
      experience,
      currentRole,
      noticePeriod,
      portfolioUrl,
      coverLetter,
      resume,
    } = req.body;

    // Basic validation
    if (!name || !email || !phone || !jobTitle) {
      return res.status(400).json({
        error: 'Required fields missing: name, email, phone, and job title are mandatory.',
      });
    }

    const targetRecipient = process.env.CAREERS_RECEIVER_EMAIL || 'es.cookscape@gmail.com';
    const senderAddress = process.env.SMTP_USER || 'webapp.cookscape@gmail.com';
    const applicationId = `CS-APP-${Math.floor(100000 + Math.random() * 900000)}`;
    const submissionTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    // Build attachments array if resume provided
    const attachments = [];
    if (resume && resume.fileData) {
      let rawBase64 = resume.fileData;
      if (rawBase64.includes('base64,')) {
        rawBase64 = rawBase64.split('base64,')[1];
      }

      attachments.push({
        filename: resume.fileName || `Resume_${name.replace(/\s+/g, '_')}.pdf`,
        content: Buffer.from(rawBase64, 'base64'),
        contentType: resume.fileType || 'application/pdf',
      });
    }

    // HTML Email Template for HR
    const htmlEmail = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Career Application: ${jobTitle}</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f3f2ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; }
        .wrapper { max-width: 650px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.08); border: 1px solid #e5e3db; }
        .hero { background: linear-gradient(135deg, #111111 0%, #1f1f1f 100%); padding: 36px 30px; text-align: center; border-bottom: 3px solid #b81c22; }
        .brand-badge { display: inline-block; background: rgba(184, 28, 34, 0.2); color: #ff6b6b; font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; padding: 6px 14px; border-radius: 100px; margin-bottom: 12px; border: 1px solid rgba(184, 28, 34, 0.4); }
        .hero h1 { color: #ffffff; font-size: 26px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: 1px; }
        .hero p { color: #b3b3b3; font-size: 14px; margin: 0; }
        .role-banner { background: #faf9f6; border-left: 4px solid #b81c22; padding: 18px 24px; margin: 24px 30px 10px; border-radius: 8px; }
        .role-title { font-size: 18px; font-weight: 700; color: #111111; margin: 0 0 4px; }
        .role-ref { font-size: 12px; color: #666; letter-spacing: 0.5px; }
        .body-content { padding: 20px 30px 30px; }
        .section-heading { font-size: 12px; font-weight: 700; color: #b81c22; text-transform: uppercase; letter-spacing: 1.5px; margin: 24px 0 12px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .data-table td { padding: 11px 8px; border-bottom: 1px solid #f0eee8; font-size: 14px; vertical-align: top; }
        .data-label { width: 150px; font-weight: 600; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .data-value { color: #111; font-weight: 500; }
        .quote-box { background: #faf8f5; border: 1px solid #ebd8c8; border-left: 4px solid #b81c22; border-radius: 8px; padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #333; margin: 12px 0 20px; white-space: pre-line; }
        .resume-card { background: #fdf6f0; border: 1px dashed #b81c22; border-radius: 10px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; margin: 16px 0; }
        .action-bar { margin: 28px 0 10px; text-align: center; }
        .btn-action { display: inline-block; background: #b81c22; color: #ffffff !important; padding: 12px 26px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 14px; margin: 0 6px 8px; }
        .btn-outline { display: inline-block; background: #111111; color: #ffffff !important; padding: 12px 26px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 14px; margin: 0 6px 8px; }
        .footer { background: #141414; padding: 22px 30px; text-align: center; color: #888; font-size: 12px; line-height: 1.6; }
        .footer strong { color: #fff; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="hero">
          <div class="brand-badge">COOKSCAPE CAREERS PORTAL</div>
          <h1>New Candidate Application</h1>
          <p>Application for <strong>${jobTitle}</strong></p>
        </div>

        <div class="role-banner">
          <div class="role-title">${jobTitle}</div>
          <div class="role-ref">Reference ID: <strong>${applicationId}</strong> &bull; Received: ${submissionTime}</div>
        </div>

        <div class="body-content">
          <div class="section-heading">Candidate Contact Information</div>
          <table class="data-table">
            <tr>
              <td class="data-label">Candidate Name</td>
              <td class="data-value"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td class="data-label">Email Address</td>
              <td class="data-value"><a href="mailto:${email}" style="color: #b81c22; text-decoration: none; font-weight: 600;">${email}</a></td>
            </tr>
            <tr>
              <td class="data-label">Phone Number</td>
              <td class="data-value"><a href="tel:${phone}" style="color: #b81c22; text-decoration: none; font-weight: 700; font-size: 15px;">${phone}</a></td>
            </tr>
            <tr>
              <td class="data-label">Current City</td>
              <td class="data-value">${location || 'Not Specified'}</td>
            </tr>
          </table>

          <div class="section-heading">Professional Background</div>
          <table class="data-table">
            <tr>
              <td class="data-label">Applied Role</td>
              <td class="data-value"><strong>${jobTitle}</strong></td>
            </tr>
            <tr>
              <td class="data-label">Total Experience</td>
              <td class="data-value">${experience || 'Not Specified'}</td>
            </tr>
            <tr>
              <td class="data-label">Current Role / Org</td>
              <td class="data-value">${currentRole || 'Not Specified'}</td>
            </tr>
            <tr>
              <td class="data-label">Notice Period</td>
              <td class="data-value">${noticePeriod || 'Not Specified'}</td>
            </tr>
            ${portfolioUrl ? `
            <tr>
              <td class="data-label">Portfolio / LinkedIn</td>
              <td class="data-value"><a href="${portfolioUrl.startsWith('http') ? portfolioUrl : 'https://' + portfolioUrl}" target="_blank" rel="noopener noreferrer" style="color: #b81c22; text-decoration: underline; font-weight: 600;">${portfolioUrl}</a></td>
            </tr>` : ''}
          </table>

          ${coverLetter ? `
          <div class="section-heading">Candidate Pitch / Introduction</div>
          <div class="quote-box">${coverLetter}</div>
          ` : ''}

          <div class="section-heading">Resume / CV Document</div>
          ${resume && resume.fileName ? `
          <div class="resume-card">
            <div>
              <div style="font-weight: 700; font-size: 14px; color: #111;">&#128196; ${resume.fileName}</div>
              <div style="font-size: 12px; color: #666; margin-top: 2px;">File Size: ${resume.fileSize || 'Attached'} &bull; Attached to this email</div>
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #2e7d32; background: #e8f5e9; padding: 4px 10px; border-radius: 4px;">Attached &#10003;</div>
          </div>
          ` : `
          <div style="padding: 12px; background: #f5f5f5; border-radius: 8px; font-size: 13px; color: #777;">
            No file attached by candidate. (Check portfolio link above if provided)
          </div>
          `}

          <div class="action-bar">
            <a href="mailto:${email}?subject=Regarding your application for ${encodeURIComponent(jobTitle)} at Cookscape [Ref: ${applicationId}]" class="btn-action">
              Reply to ${name.split(' ')[0]}
            </a>
            <a href="tel:${phone}" class="btn-outline">
              Call Candidate (${phone})
            </a>
          </div>
        </div>

        <div class="footer">
          <p><strong>Cookscape Interiors HR & Recruitment System</strong></p>
          <p>This application was submitted via the official Cookscape Careers portal on ${submissionTime}.</p>
          <p>Recipient: ${targetRecipient}</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Cookscape Careers Portal" <${senderAddress}>`,
      to: targetRecipient,
      replyTo: `${name} <${email}>`,
      subject: `New Job Application: ${jobTitle} - ${name} [${applicationId}]`,
      html: htmlEmail,
      attachments: attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Job application email sent successfully to ${targetRecipient} for ${name} (${jobTitle}): ${info.messageId}`);

    return res.status(200).json({
      success: true,
      message: 'Application received and forwarded to HR successfully!',
      applicationId: applicationId,
    });
  } catch (error) {
    console.error('Error handling job application submission:', error);
    return res.status(500).json({
      error: 'Failed to send application email. Please verify connection and try again.',
      details: error.message,
    });
  }
};
