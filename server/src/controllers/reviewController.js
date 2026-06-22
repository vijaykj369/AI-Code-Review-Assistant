const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const { reviewCode } = require('../services/openaiService');

// CREATE REVIEW
const analyzeCode = asyncHandler(async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({
      success: false,
      message: 'Language and code are required',
    });
  }

  const aiReview = await reviewCode({ language, code });

  const review = await Review.create({
    user: req.user.id,
    language,
    code,
    score: aiReview?.score || 0,
    bugs: aiReview?.bugs || [],
    securityIssues: aiReview?.securityIssues || [],
    performanceIssues: aiReview?.performanceIssues || [],
    suggestions: aiReview?.suggestions || [],
    improvedCode: aiReview?.improvedCode || '',
    summary: aiReview?.summary || '',
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});

// GET ALL REVIEWS
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    user: req.user.id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// GET SINGLE REVIEW
const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// DELETE REVIEW
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

module.exports = {
  analyzeCode,
  getReviews,
  getReviewById,
  deleteReview,
};