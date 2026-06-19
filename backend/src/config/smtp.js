const nodemailer = require('nodemailer');

const requiredSmtpConfig = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];

const getMissingSmtpConfig = () => requiredSmtpConfig.filter((key) => !process.env[key]);

const isSmtpConfigured = () => getMissingSmtpConfig().length === 0;

const getSmtpPort = () => Number(process.env.SMTP_PORT || 587);

const createTransporter = () => {
  const missingConfig = getMissingSmtpConfig();

  if (missingConfig.length) {
    console.warn(`SMTP not configured. Missing ${missingConfig.join(', ')}. Email OTP APIs will return 503.`);
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: getSmtpPort(),
    secure: getSmtpPort() === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

const verifySmtpSafely = async () => {
  if (!transporter) {
    console.warn('SMTP verification skipped because SMTP is not configured.');
    return false;
  }

  try {
    await transporter.verify();
    console.log('SMTP verified successfully');
    return true;
  } catch (error) {
    console.warn(`SMTP verification failed: ${error.message}`);
    return false;
  }
};

module.exports = {
  getMissingSmtpConfig,
  isSmtpConfigured,
  transporter,
  verifySmtpSafely,
};
