const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Helper to format date as "1st May 2025"
const formatDateString = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const getOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${getOrdinal(day)} ${month} ${year}`;
};

// Helper to format duration text cleanly
const formatDuration = (val) => {
  if (!val) return '60 Days';
  if (typeof val === 'string') {
    const s = val.trim();
    if (s.toLowerCase().includes('day') || s.toLowerCase().includes('week') || s.toLowerCase().includes('month')) {
      return s;
    }
  }
  const m = parseInt(val, 10);
  if (isNaN(m) || m <= 0) return '60 Days';
  if (m === 1) return '30 Days (1 Month)';
  if (m === 2) return '60 Days (2 Months)';
  if (m === 3) return '90 Days (3 Months)';
  if (m === 6) return '6 Months';
  return `${m} Months`;
};

// Helper to generate an authentic, direct corporate email (no artificial card boxes)
const getHtmlContent = (studentName, formattedDate, formattedDuration, pdfAttachmentName = 'Offer_Letter.pdf', domain = '') => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      color: #222222;
      line-height: 1.6;
      margin: 0;
      padding: 12px 0;
      background-color: #ffffff;
    }
    p {
      margin: 0 0 14px 0;
    }
    ul {
      margin: 8px 0 16px 20px;
      padding: 0;
    }
    li {
      margin-bottom: 6px;
    }
    a {
      color: #1a73e8;
      text-decoration: underline;
    }
  </style>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #222222; line-height: 1.6; margin: 0; padding: 12px 0; background-color: #ffffff;">

  <div style="max-width: 680px; margin: 0; padding: 0;">
    
    <p style="margin: 0 0 14px 0;">Dear ${studentName},</p>

    <p style="margin: 0 0 14px 0;">I hope this email finds you well.</p>

    <p style="margin: 0 0 14px 0;">
      We are pleased to welcome you to <strong>PaulTech Software Services (OPC) Pvt Ltd</strong> as an intern${domain ? ` for <strong>${domain}</strong>` : ''}. We believe your skills and enthusiasm will be a valuable addition to our team, and we look forward to working with you.
    </p>

    <p style="margin: 0 0 6px 0;"><strong>Internship Details &amp; Onboarding Information:</strong></p>
    <ul style="margin: 6px 0 16px 24px; padding: 0; line-height: 1.6;">
      <li style="margin-bottom: 5px;"><strong>Start Date:</strong> ${formattedDate}</li>
      <li style="margin-bottom: 5px;"><strong>Duration:</strong> ${formattedDuration}</li>
      <li style="margin-bottom: 5px;"><strong>Domain / Role:</strong> ${domain || 'Software Services'}</li>
      <li style="margin-bottom: 5px;"><strong>Reporting Authority:</strong> Mrs. Daljeet Paul, Senior HR Department</li>
      <li style="margin-bottom: 5px;"><strong>Items to Carry:</strong> Copy of your Aadhaar card, 2 passport-size photographs, and your laptop (if available).</li>
    </ul>

    <p style="margin: 0 0 14px 0;">
      We are excited to have you join us and look forward to a successful and enriching internship experience. If you have any questions regarding your orientation or schedule, please feel free to reply directly to this email.
    </p>

    <br>

    <!-- Authentic Corporate Signature Block -->
    <div style="margin-top: 10px; padding-top: 14px; border-top: 1px solid #d1d5db; font-family: Arial, Helvetica, sans-serif;">
      <div style="font-weight: bold; color: #111111; font-size: 14px; margin-bottom: 2px;">Thanks &amp; Regards,</div>
      <div style="font-weight: bold; color: #111111; font-size: 15px;">Mrs. Daljeet Paul</div>
      <div style="font-weight: bold; color: #ea580c; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">HR Manager Head</div>
      <div style="color: #4b5563; font-size: 13px; margin-bottom: 8px;">PaulTech Software Services (OPC) Pvt. Ltd.</div>

      <img src="cid:paultech_logo" alt="PaulTech Logo" style="height: 38px; width: auto; margin-bottom: 10px; display: block;" />

      <div style="font-size: 12.5px; color: #555555; line-height: 1.55;">
        <div>📞 <strong>Contact No:</strong> 7209986943 / 7061273234</div>
        <div>✉️ <strong>Email:</strong> <a href="mailto:hr@paultechsoftwareservices.com" style="color: #1a73e8; text-decoration: none;">hr@paultechsoftwareservices.com</a></div>
        <div>🌐 <strong>Website:</strong> <a href="https://paultechsoftwareservices.com" style="color: #1a73e8; text-decoration: none;">https://paultechsoftwareservices.com</a></div>
        <div>📍 <strong>Address:</strong> 1st Floor, Pacific Height Building, Aambagan, Sakchi, Jamshedpur - 831001</div>
        <div style="margin-top: 4px; font-weight: bold; color: #333333;">GSTIN: 20AAKCP7675D1ZE</div>
      </div>
    </div>

  </div>

</body>
</html>`;
};

const sendWelcomeEmail = async (student) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const user = process.env.EMAIL_USER;

  // 1. AUTOMATICALLY COMPILE OFFICIAL OFFER LETTER PDF
  let offerLetterPdf = null;
  try {
    const { generateOfferLetterPdfBuffer } = require('./pdfGenerator');
    console.log(`Mailer: Automatically compiling official Offer Letter PDF for ${student.name} (${student.domain})...`);
    offerLetterPdf = await generateOfferLetterPdfBuffer(student, student.domain);
    if (offerLetterPdf && offerLetterPdf.success) {
      console.log(`Mailer: Offer Letter PDF compiled successfully: ${offerLetterPdf.filename} (${(offerLetterPdf.pdfBuffer.length / 1024).toFixed(1)} KB)`);
    } else {
      console.warn(`Mailer Warning: PDF generation returned no buffer: ${offerLetterPdf?.error || 'Unknown error'}`);
    }
  } catch (pdfCompilationErr) {
    console.error('Mailer: Error compiling automated Offer Letter PDF:', pdfCompilationErr);
  }

  const pdfAttachmentName = offerLetterPdf?.filename || `Offer_Letter_${(student.name || 'Candidate').replace(/\s+/g, '_')}.pdf`;

  if (brevoApiKey) {
    console.log(`Mailer: Detected BREVO_API_KEY. Sending email via Brevo HTTP API...`);
    try {
      const logoPath = path.join(__dirname, '..', 'logo.png');
      let logoBase64 = '';
      try {
        logoPathCandidate = [
          path.join(__dirname, '..', 'logo.png'),
          path.join(__dirname, '..', '..', 'frontend', 'public', 'logo.png')
        ].find(p => fs.existsSync(p));
        if (logoPathCandidate) {
          logoBase64 = fs.readFileSync(logoPathCandidate).toString('base64');
        }
      } catch (err) {
        console.error('Failed to read logo.png for Brevo attachment:', err);
      }

      const formattedDate = formatDateString(student.joining_date);
      const formattedDuration = formatDuration(student.duration);
      const htmlContent = getHtmlContent(student.name, formattedDate, formattedDuration, pdfAttachmentName, student.domain);

      const senderEmail = user || 'hr@paultechsoftwareservices.com';

      const body = {
        sender: {
          name: "Daljeet Paul",
          email: senderEmail
        },
        to: [
          {
            email: student.email,
            name: student.name
          }
        ],
        subject: `Welcome to PAULTECH - Internship Offer Letter for ${student.name}`,
        htmlContent: htmlContent,
        attachment: []
      };

      // Inline Logo Attachment
      if (logoBase64) {
        body.attachment.push({
          content: logoBase64,
          name: 'logo.png',
          cid: 'paultech_logo'
        });
      }

      // AUTOMATED OFFER LETTER PDF ATTACHMENT
      if (offerLetterPdf && offerLetterPdf.success && offerLetterPdf.pdfBuffer) {
        body.attachment.push({
          name: offerLetterPdf.filename,
          content: offerLetterPdf.pdfBuffer.toString('base64')
        });
        console.log(`Mailer: Attached automated PDF (${offerLetterPdf.filename}) to Brevo email payload.`);
      }

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.message || `HTTP error ${response.status}`);
      }

      console.log(`Welcome email with Offer Letter PDF successfully sent via Brevo HTTP API to ${student.email}: ${resJson.messageId}`);
      return { success: true, messageId: resJson.messageId, pdfAttached: !!offerLetterPdf?.success };
    } catch (error) {
      console.warn(`Mailer Warning: Brevo dispatch failed for ${student.email} (${error.message}). Falling back to Gmail SMTP...`);
    }
  }

  // Fallback to SMTP (Nodemailer)
  console.log(`Mailer: Dispatching email via SMTP connection...`);
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('Mailer Warning: EMAIL_USER or EMAIL_PASS environment variables are not configured. Welcome email was not sent.');
    return { success: false, error: 'Email configuration missing in backend env' };
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465,
    auth: {
      user: user,
      pass: pass
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });

  const formattedDate = formatDateString(student.joining_date);
  const formattedDuration = formatDuration(student.duration);
  const htmlContent = getHtmlContent(student.name, formattedDate, formattedDuration, pdfAttachmentName, student.domain);

  const possibleLogoPaths = [
    path.join(__dirname, '..', 'templates', 'assets', 'logo.png'),
    path.join(__dirname, '..', '..', 'frontend', 'public', 'logo.png'),
    path.join(__dirname, '..', 'logo.png')
  ];
  const foundLogoPath = possibleLogoPaths.find(p => fs.existsSync(p));
  const attachments = [];
  if (foundLogoPath) {
    attachments.push({
      filename: 'logo.png',
      path: foundLogoPath,
      cid: 'paultech_logo'
    });
  }

  // AUTOMATED OFFER LETTER PDF ATTACHMENT
  if (offerLetterPdf && offerLetterPdf.success && offerLetterPdf.pdfBuffer) {
    attachments.push({
      filename: offerLetterPdf.filename,
      content: offerLetterPdf.pdfBuffer,
      contentType: 'application/pdf'
    });
    console.log(`Mailer: Attached automated PDF (${offerLetterPdf.filename}) to SMTP email payload.`);
  }

  const mailOptions = {
    from: `"Daljeet Paul" <${user}>`,
    to: student.email,
    subject: `Welcome to PAULTECH - Internship Offer Letter for ${student.name}`,
    html: htmlContent,
    attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email with Offer Letter PDF successfully sent via SMTP to ${student.email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId, pdfAttached: !!offerLetterPdf?.success };
  } catch (error) {
    console.error(`Mailer Error: Failed to send welcome email via SMTP to ${student.email}:`, error);
    return { success: false, error: error.message };
  }
};

const sendPaymentReceiptEmail = async ({ candidateName, candidateEmail, jobTitle, amount = 1000, paymentId, paymentMethod }) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const user = process.env.EMAIL_USER;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
      .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
      .header { border-bottom: 2px solid #f97316; padding-bottom: 16px; margin-bottom: 20px; }
      .title { color: #0f172a; font-size: 20px; font-weight: 800; margin: 0; }
      .amount-badge { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 12px; rounded: 12px; text-align: center; margin: 20px 0; border-radius: 12px; }
      .amount { font-size: 26px; font-weight: 900; color: #15803d; }
      .receipt-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      .receipt-table td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
      .label { color: #64748b; font-weight: 600; }
      .val { color: #0f172a; font-weight: 700; text-align: right; }
      .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 class="title">🎉 Application & Payment Receipt</h2>
        <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">PaulTech Software Services Pvt Ltd</p>
      </div>

      <p>Dear <strong>${candidateName}</strong>,</p>
      <p>Thank you for registering for <strong>${jobTitle}</strong>. We have successfully received your registration fee payment.</p>

      <div class="amount-badge">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Registration Fee Paid</div>
        <div class="amount">₹${amount.toLocaleString('en-IN')} INR</div>
        <div style="font-size: 12px; margin-top: 2px;">Status: <strong>VERIFIED & CONFIRMED</strong></div>
      </div>

      <table class="receipt-table">
        <tr>
          <td class="label">Transaction ID</td>
          <td class="val" style="font-family: monospace;">${paymentId || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Payment Mode</td>
          <td class="val">${paymentMethod || 'Razorpay Gateway'}</td>
        </tr>
        <tr>
          <td class="label">Applied Domain / Role</td>
          <td class="val">${jobTitle}</td>
        </tr>
        <tr>
          <td class="label">Date</td>
          <td class="val">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
        </tr>
      </table>

      <p style="font-size: 13px; color: #475569; margin-top: 20px;">
        Our Student Admissions Team will review your application details and contact you via Email / WhatsApp with your Internship Orientation & Schedule details.
      </p>

      <div class="footer">
        <strong>PaulTech Software Services (OPC) Pvt Ltd</strong><br />
        Support Contact: 7061272344, 7903174066 | Website: www.paultechsoftwareservices.com
      </div>
    </div>
  </body>
  </html>
  `;

  let sentViaBrevo = false;
  if (brevoApiKey) {
    try {
      const senderEmail = user || 'ganesh.bca2303082@nsuniv.ac.in';
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: "PaulTech Software Services", email: senderEmail },
          to: [{ email: candidateEmail, name: candidateName }],
          subject: `Payment Receipt: ₹${amount} - ${jobTitle} Registration`,
          htmlContent: htmlContent
        })
      });
      if (response.ok) {
        sentViaBrevo = true;
        console.log(`Payment receipt email sent via Brevo to ${candidateEmail}`);
      } else {
        const errJson = await response.json();
        console.warn('Brevo payment receipt warning:', errJson.message);
      }
    } catch (e) {
      console.warn('Failed to send payment receipt email via Brevo, falling back to SMTP:', e.message);
    }
  }

  // Fallback to SMTP if Brevo didn't succeed
  if (!sentViaBrevo && user && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: parseInt(process.env.EMAIL_PORT || '587') === 465,
        auth: { user, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: `"PaulTech Software Services" <${user}>`,
        to: candidateEmail,
        subject: `Payment Receipt: ₹${amount} - ${jobTitle} Registration`,
        html: htmlContent
      });
      console.log(`Payment receipt email sent via SMTP to ${candidateEmail}`);
    } catch (smtpErr) {
      console.error('SMTP payment receipt error:', smtpErr);
    }
  }
};

module.exports = { sendWelcomeEmail, sendPaymentReceiptEmail };
