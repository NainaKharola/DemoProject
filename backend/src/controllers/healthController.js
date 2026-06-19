const mongoose = require('mongoose');
const { isSmtpConfigured } = require('../config/smtp');

const getHealth = (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    environment: process.env.NODE_ENV || 'development',
    emailService: isSmtpConfigured() ? 'configured' : 'not_configured',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealth
};
