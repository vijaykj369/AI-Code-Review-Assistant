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
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Repository URL is required',
      });
    }

    console.log('Repository URL:', repoUrl);

    // Fetch repository files
    const files = await getRepositoryFiles(repoUrl);

    console.log('Fetched files:', files.length);

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          'No supported source files found in repository',
      });
    }

    // AI review
    const aiReview = await reviewRepository(files);

    console.log('AI REVIEW:', aiReview);

    const { owner, repo } =
      extractRepoInfo(repoUrl);

    // Ensure arrays always exist
    const repoReview =
      await RepoReview.create({
        user: req.user.id,

        repoName: `${owner}/${repo}`,

        repoUrl,

        fileCount: files.length,

        score:
          Number(aiReview?.score) || 0,

        architectureFeedback:
          Array.isArray(
            aiReview?.architectureFeedback
          )
            ? aiReview.architectureFeedback
            : [],

        securityIssues:
          Array.isArray(
            aiReview?.securityIssues
          )
            ? aiReview.securityIssues
            : [],

        performanceIssues:
          Array.isArray(
            aiReview?.performanceIssues
          )
            ? aiReview.performanceIssues
            : [],

        suggestions:
          Array.isArray(
            aiReview?.suggestions
          )
            ? aiReview.suggestions
            : [],

        summary:
          aiReview?.summary || '',
      });

    return res.status(201).json({
      success: true,
      data: repoReview,
    });
  } catch (error) {
    console.error(
      'REPO CONTROLLER ERROR:'
    );
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        'Repository review failed',
      stack: error.stack,
    });
  }
});

// =========================
// GET HISTORY
// =========================
const getRepoReviews =
  asyncHandler(async (req, res) => {
    const reviews =
      await RepoReview.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  });

// =========================
// GET SINGLE REVIEW
// =========================
const getRepoReviewById =
  asyncHandler(async (req, res) => {
    const review =
      await RepoReview.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          'Repository review not found',
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  });

// =========================
// DELETE REVIEW
// =========================
const deleteRepoReview =
  asyncHandler(async (req, res) => {
    const review =
      await RepoReview.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          'Repository review not found',
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message:
        'Repository review deleted successfully',
    });
  });

module.exports = {
  reviewRepo,
  getRepoReviews,
  getRepoReviewById,
  deleteRepoReview,
};