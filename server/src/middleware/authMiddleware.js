// src/middleware/authMiddleware.js
// `protect` guards routes that require a logged-in user. It expects
// a Bearer token in the Authorization header, verifies it, and attaches
// the decoded user id to req.user for downstream controllers to use.

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const { jwtSecret } = require('../config/env');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized — no token provided');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Confirm the user still exists (e.g. wasn't deleted after the
    // token was issued) and attach a lean user reference to req.user.
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'Not authorized — user no longer exists');
    }

    req.user = { id: user._id.toString() };
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // jwt.verify throws its own errors (TokenExpiredError, JsonWebTokenError)
    throw new ApiError(401, 'Not authorized — invalid or expired token');
  }
});

module.exports = { protect };