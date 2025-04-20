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
    console.log("done 1");
    const result = await userModel.findUserByEmail(email);
    console.log("done 2");
    if (!result || !(await bcrypt.compare(password, result.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log("done 3");
    const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
    console.log("done 4");
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
