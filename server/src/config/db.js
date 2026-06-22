// src/config/db.js
// Handles the MongoDB connection lifecycle using Mongoose.
// Exporting a single connectDB function keeps server.js clean and
// makes it trivial to swap connection logic later (e.g. add retries).

const mongoose = require('mongoose');
const { mongoUri } = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit process with failure — there's no point running the API
    // without a database connection.
    process.exit(1);
  }
};

// Optional: log unexpected disconnects in development so issues
// during local dev aren't silent.
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

module.exports = connectDB;