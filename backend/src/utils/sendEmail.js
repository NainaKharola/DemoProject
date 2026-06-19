const { transporter } = require('../config/smtp');

const createEmailServiceError = (message, code) => {
  const error = new Error(message);
  error.statusCode = 503;
  error.code = code;
  return error;
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    throw createEmailServiceError('Email service is not configured', 'EMAIL_SERVICE_NOT_CONFIGURED');
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error.message);
    throw createEmailServiceError('Email service is not available. Please contact admin.', 'EMAIL_DELIVERY_FAILED');
  }
};

module.exports = sendEmail;
