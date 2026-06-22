// src/utils/generateToken.js
// Single source of truth for creating JWTs so the signing logic
// (secret, expiry, payload shape) lives in exactly one place.

const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const generateToken = (userId) => {
  // Payload only carries the user id — never put sensitive data
  // (passwords, etc.) in a JWT payload since it's just base64-encoded,
  // not encrypted, and can be decoded by anyone holding the token.
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: jwtExpiresIn });
};

module.exports = generateToken;