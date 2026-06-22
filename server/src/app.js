// src/app.js
// Configures the Express application: global middleware, route mounting,
// and error handlers. Kept separate from server.js so the app instance
// can be imported in tests without actually starting a server/listening
// on a port.

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { clientUrl, nodeEnv } = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- Global middleware ---

// Parse incoming JSON bodies (req.body)
app.use(express.json({ limit: '2mb' })); // higher limit: code paste payloads can be large
app.use(express.urlencoded({ extended: true }));

// Allow requests from the React client only
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

// Request logging — concise in prod, verbose ('dev') in development
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
  });
});

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/repo', require('./routes/repoRoutes'));

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;