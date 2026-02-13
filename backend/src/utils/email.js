const nodemailer = require("nodemailer");

// Create a reusable transporter using environment variables.
// If email configuration is missing, we will fall back to logging the reset link.
function createTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465, // true for 465, false for others
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

async function sendEmail({ to, subject, html }) {
  const transporter = createTransporter();

  // If there is no transporter configured, log the email details for development.
  if (!transporter) {
    console.log("Email configuration missing. Would have sent email to:", to);
    console.log("Subject:", subject);
    console.log("HTML content:", html);
    return;
  }

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}

module.exports = {
  sendEmail,
};

