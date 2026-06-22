const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  reviewRepo,
  getRepoReviews,
  getRepoReviewById,
  deleteRepoReview,
} = require('../controllers/repoController');

router.post('/review', protect, reviewRepo);

router.get('/', protect, getRepoReviews);

router.get('/:id', protect, getRepoReviewById);

router.delete('/:id', protect, deleteRepoReview);

module.exports = router;