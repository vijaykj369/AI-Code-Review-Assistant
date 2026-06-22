const express = require('express');
const router = express.Router();

const {
  analyzeCode,
  getReviews,
  getReviewById,
  deleteReview,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeCode);

router.get('/', protect, getReviews);

router.get('/:id', protect, getReviewById);

router.delete('/:id', protect, deleteReview);

module.exports = router;