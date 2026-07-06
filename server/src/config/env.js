// src/config/env.js
// Centralizes access to environment variables so the rest of the app
// never calls process.env directly. Makes it easy to validate required
// vars in one place and fail fast on startup if something is missing.

require('dotenv').config();

const required = ['MONGO_URI', 'JWT_SECRET'];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  // Fail fast: better to crash on boot than to fail mysteriously later.
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  groqApiKey: process.env.GROQ_API_KEY || '',
  githubToken: process.env.GITHUB_TOKEN || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};