// src/server.js
// The actual entry point. Responsible only for:
// 1. Connecting to MongoDB
// 2. Starting the HTTP server
// Keeping this separate from app.js means app.js stays a pure,
// importable Express config with no side effects.

const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');

const startServer = async () => {
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Handle unhandled promise rejections gracefully instead of crashing
  // silently or leaving the process in a weird state.
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();