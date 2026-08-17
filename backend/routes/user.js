const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticateToken } = require('../middleware/auth');

// ─────────────────────────────────────────────
// POST /api/v1/sign-up
// ─────────────────────────────────────────────
router.post('/sign-up', async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Validation
    if (!username || username.trim().length < 4) {
      return res.status(400).json({
        status: 'error',
        message: 'Username must be at least 4 characters long',
      });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'A valid email address is required',
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long',
      });
    }
    if (!address || address.trim().length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'Address must be at least 3 characters long',
      });
    }

    // Duplicate checks
    const existingUsername = await User.findOne({ username: username.trim() });
    if (existingUsername) {
      return res.status(409).json({ status: 'error', message: 'Username is already taken' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(409).json({ status: 'error', message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      address: address.trim(),
      role: 'user',
    });

    return res.status(201).json({ status: 'success', message: 'Account created successfully' });
  } catch (error) {
    console.error('SIGN-UP ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// POST /api/v1/login
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username and password are required',
      });
    }

    const existingUser = await User.findOne({ username: username.trim() });
    if (!existingUser) {
      return res.status(400).json({ status: 'error', message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ status: 'error', message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: existingUser._id, name: existingUser.username, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      id: existingUser._id,
      username: existingUser.username,
      role: existingUser.role,
      token,
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// GET /api/v1/get-user-information
// ─────────────────────────────────────────────
router.get('/get-user-information', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    return res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    console.error('GET USER INFO ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/v1/update-address
// ─────────────────────────────────────────────
router.put('/update-address', authenticateToken, async (req, res) => {
  try {
    const { address } = req.body;
    if (!address || address.trim().length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'Address must be at least 3 characters long',
      });
    }
    await User.findByIdAndUpdate(req.user.id, { address: address.trim() });
    return res.status(200).json({ status: 'success', message: 'Address updated successfully' });
  } catch (error) {
    console.error('UPDATE ADDRESS ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

module.exports = router;
