const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter (The Mailman)
  // Get these from your Mailtrap "Inboxes" -> "SMTP Settings" -> "Integrations: Nodemailer"
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "YOUR_MAILTRAP_USER_ID", // Replace with your actual user ID
      pass: "YOUR_MAILTRAP_PASSWORD" // Replace with your actual password
    }
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'SupportSync <noreply@supportsync.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // Using HTML makes the link clickable in most email clients
    html: `<div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px;">
            <h3>SupportSync Password Reset</h3>
            <p>${options.message.replace(/\n/g, '<br>')}</p>
            <p>If you didn't request this, please ignore this email.</p>
           </div>`
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

// Exporting the function directly
module.exports = sendEmail;