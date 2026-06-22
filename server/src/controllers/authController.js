// src/controllers/authController.js
// Business logic for authentication. Wrapped with express-async-handler
// so any thrown error (or rejected promise) inside these functions is
// automatically forwarded to next(err) -> our errorHandler middleware,
// instead of needing a try/catch in every single function.

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are all required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // Password gets hashed automatically by the pre('save') hook on User.
  const user = await User.create({ name, email, password });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      user, // toJSON() on the model strips the password automatically
      token,
    },
  });
});

// @desc    Authenticate user & return token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // Explicitly select password since the schema excludes it by default.
  const user = await User.findOne({ email }).select('+password');

  // Deliberately use the same error message for "user not found" and
  // "wrong password" — this avoids leaking which emails are registered.
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
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
  // req.user is attached by the `protect` middleware after verifying
  // the JWT — see middleware/authMiddleware.js
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

module.exports = { registerUser, loginUser, getMe };