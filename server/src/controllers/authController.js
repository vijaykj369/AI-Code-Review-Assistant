// src/controllers/authController.js

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

// Email validation regex
const emailRegex =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Strong password validation regex
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=[\]{};':\\|,.<>/?]).{8,}$/;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(
      400,
      'Name, email, and password are all required'
    );
  }

  // Trim inputs
  name = name.trim();
  email = email.trim().toLowerCase();

  // Validate email
  if (!emailRegex.test(email)) {
    throw new ApiError(
      400,
      'Please enter a valid email address'
    );
  }

  // Validate password
  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      'Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.'
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(
      409,
      'An account with this email already exists'
    );
  }

  // Password is hashed automatically by User model
  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      user,
      token,
    },
  });
});

// @desc    Authenticate user & return token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      400,
      'Email and password are required'
    );
  }

  email = email.trim().toLowerCase();

  // Validate email format
  if (!emailRegex.test(email)) {
    throw new ApiError(
      400,
      'Please enter a valid email address'
    );
  }

  // Explicitly include password
  const user = await User.findOne({ email }).select('+password');

  // Same error for invalid email/password
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(
      401,
      'Invalid email or password'
    );
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    data: {
      user,
      token,
    },
  });
});

// @desc    Get current logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};