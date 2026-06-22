// src/routes/authRoutes.js
// Maps HTTP verbs + paths to controller functions. Route files stay
// thin — no logic here, just wiring (and middleware attachment).

const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe); // protected: requires valid JWT

module.exports = router;