// src/utils/ApiError.js
// A custom error class so every intentional error thrown in the app
// carries an HTTP status code alongside its message. The error
// middleware reads `statusCode` off this to set the response status.

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    // "Operational" errors are expected (bad input, not found, etc.)
    // as opposed to programmer bugs. Useful if you later want to
    // alert on non-operational errors only.
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;