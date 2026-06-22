const asyncHandler = require('express-async-handler');

const {
  getRepositoryFiles,
  extractRepoInfo,
} = require('../services/githubService');

const {
  reviewRepository,
} = require('../services/openaiService');

const RepoReview = require('../models/RepoReview');

// =========================
// REVIEW REPOSITORY
// POST /api/repo/review
// =========================
const reviewRepo = asyncHandler(async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({
      success: false,
      message: 'Repository URL is required',
    });
  }

  const files = await getRepositoryFiles(repoUrl);

  const aiReview = await reviewRepository(files);

  const { owner, repo } = extractRepoInfo(repoUrl);

  const repoReview = await RepoReview.create({
    user: req.user.id,
    repoName: `${owner}/${repo}`,
    repoUrl,
    fileCount: files.length,

    score: aiReview.score || 0,
    architectureFeedback:
      aiReview.architectureFeedback || [],
    securityIssues:
      aiReview.securityIssues || [],
    performanceIssues:
      aiReview.performanceIssues || [],
    suggestions:
      aiReview.suggestions || [],
    summary:
      aiReview.summary || '',
  });

  res.status(201).json({
    success: true,
    data: repoReview,
  });
});

// =========================
// GET REPOSITORY HISTORY
// GET /api/repo
// =========================
const getRepoReviews = asyncHandler(async (req, res) => {
  const reviews = await RepoReview.find({
    user: req.user.id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// =========================
// GET SINGLE REPOSITORY REVIEW
// GET /api/repo/:id
// =========================
const getRepoReviewById = asyncHandler(async (req, res) => {
  const review = await RepoReview.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Repository review not found',
    });
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// =========================
// DELETE REPOSITORY REVIEW
// DELETE /api/repo/:id
// =========================
const deleteRepoReview = asyncHandler(async (req, res) => {
  const review = await RepoReview.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Repository review not found',
    });
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Repository review deleted successfully',
  });
});

module.exports = {
  reviewRepo,
  getRepoReviews,
  getRepoReviewById,
  deleteRepoReview,
};