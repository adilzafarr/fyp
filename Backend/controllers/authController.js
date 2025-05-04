const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const { sendResetCode } = require('../utils/emailService');


exports.signup = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await userModel.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(email, hashed, name); // Make sure your model supports this

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userModel.findUserByEmail(email);
    if (!result || !(await bcrypt.compare(password, result.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'Email not found' });

  const code = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000);
  await userModel.updateResetCode(email, code, expires);
  await sendResetCode(email, code);
  res.json({ message: 'Reset code sent' });
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await userModel.findUserByEmail(email);
  if (!user || user.reset_code !== code || new Date() > user.reset_code_expires) {
    return res.status(400).json({ message: 'Invalid or expired code' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await userModel.resetPassword(email, hashed);
  res.json({ message: 'Password reset successful' });
};

exports.getName = async (req, res) => {
  const { email } = req.body;
  const {name ,id} = await userModel.findNameByEmail(email);
  res.json({name: name, id: id});
};

exports.validateToken = async (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
}

exports.deleteAccount = async (req, res) => {
  const { email } = req.body;
  await userModel.deleteUser(email);
  res.json({ message: 'Account deleted successfully' });
}

exports.changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  // Check if all fields are provided
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'براہ کرم تمام فیلڈز مکمل کریں۔' });
  }

  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'صارف نہیں ملا۔' });
    }

    // Correct way: Compare plain oldPassword with stored hashed password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'پرانا پاسورڈ درست نہیں ہے۔' });
    }

    // Hash the new password now
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await userModel.changePassword(email, hashedNewPassword);

    res.json({ message: 'پاسورڈ کامیابی سے تبدیل ہو گیا۔' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'سرور کی خرابی۔ براہ کرم بعد میں کوشش کریں۔' });
  }
};
