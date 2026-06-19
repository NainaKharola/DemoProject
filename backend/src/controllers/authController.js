const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateOtp = require('../utils/generateOtp');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const normalizeEmail = (email) => email.trim().toLowerCase();

const getOtpExpiryDate = () => {
  const minutes = Number(process.env.OTP_EXPIRES_IN_MINUTES || 10);
  return new Date(Date.now() + minutes * 60 * 1000);
};

const sanitizeUser = (user) => user.toJSON();

const isEmailServiceError = (error) => [
  'EMAIL_SERVICE_NOT_CONFIGURED',
  'EMAIL_DELIVERY_FAILED',
].includes(error.code);

const sendOtpServiceUnavailable = (res) => res.status(503).json({
  success: false,
  message: 'Email service is not configured. OTP cannot be sent.',
});

const sendOtpEmail = async ({ email, name, otp, purpose }) => {
  const appName = process.env.APP_NAME || 'Project Auth';
  const subject = purpose === 'login' ? `${appName} login OTP` : `${appName} verification OTP`;
  const heading = purpose === 'login' ? 'Login verification' : 'Email verification';

  await sendEmail({
    to: email,
    subject,
    text: `Your ${heading.toLowerCase()} code is ${otp}. It expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #172033;">
        <h2>${heading}</h2>
        <p>Hello ${name},</p>
        <p>Your OTP is:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
        <p>This code expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.</p>
      </div>
    `,
  });
};

const saveOtpForUser = async (user, purpose) => {
  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpiresAt = getOtpExpiryDate();

  await sendOtpEmail({ email: user.email, name: user.name, otp, purpose });

  user.otp = hashedOtp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();
};

const verifyOtpForUser = async ({ email, otp }) => {
  const user = await User.findOne({ email: normalizeEmail(email) }).select('+otp +otpExpiresAt');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (!user.otp || !user.otpExpiresAt) {
    const error = new Error('OTP not found. Please request a new code.');
    error.statusCode = 400;
    throw error;
  }

  if (user.otpExpiresAt.getTime() < Date.now()) {
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const error = new Error('OTP expired. Please request a new code.');
    error.statusCode = 400;
    throw error;
  }

  const isOtpValid = await bcrypt.compare(String(otp), user.otp);

  if (!isOtpValid) {
    const error = new Error('Invalid OTP');
    error.statusCode = 400;
    throw error;
  }

  user.otp = undefined;
  user.otpExpiresAt = undefined;
  return user;
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isEmailVerified: false,
    });

    await saveOtpForUser(user, 'register');

    return res.status(201).json({
      success: true,
      message: 'Registration successful. OTP sent to your email.',
      email: user.email,
    });
  } catch (error) {
    if (isEmailServiceError(error)) {
      return sendOtpServiceUnavailable(res);
    }

    next(error);
  }
};

const verifyRegisterOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const user = await verifyOtpForUser({ email, otp });
    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (isEmailServiceError(error)) {
      return sendOtpServiceUnavailable(res);
    }

    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: normalizeEmail(email) }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    await saveOtpForUser(user, 'login');

    return res.status(200).json({
      success: true,
      message: 'Login OTP sent to your email.',
      email: user.email,
    });
  } catch (error) {
    if (isEmailServiceError(error)) {
      return sendOtpServiceUnavailable(res);
    }

    next(error);
  }
};

const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const user = await verifyOtpForUser({ email, otp });
    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Login verified successfully',
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  });
};

module.exports = {
  getProfile,
  login,
  register,
  verifyLoginOtp,
  verifyRegisterOtp,
};
