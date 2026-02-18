const nodemailer = require("nodemailer");

/**
 * Utility to send emails using Nodemailer
 * @param {Object} options - { to, subject, html }
 */
const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail App Password
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `"SupportSync" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully to:", options.to);
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = { sendEmail };