// src/middleware/errorMiddleware.js
// Two middlewares:
// 1. notFound — catches requests to routes that don't exist (404).
// 2. errorHandler — the final catch-all. Any error passed to next(err)
//    anywhere in the app (including inside async handlers) ends up here.

const { nodeEnv } = require('../config/env');

const notFound = (req, res, next) => {
  const message = `Route not found: ${req.originalUrl}`;
  res.status(404);
  next(new Error(message));
};

// Express recognizes this as an error handler because it takes 4 args.
// It MUST be registered last, after all routes.
const errorHandler = (err, req, res, next) => {
  // If a status was already set (e.g. via res.status(404) above or
  // ApiError), use it. Otherwise default to 500.
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  if (err.statusCode) statusCode = err.statusCode;

  // Handle common Mongoose errors with friendlier messages/status codes.
  let message = err.message;

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.code === 11000) {
    // Mongo duplicate key error (e.g. duplicate email on register)
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field} already in use`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only leak stack traces in development, never in production.
    stack: nodeEnv === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };