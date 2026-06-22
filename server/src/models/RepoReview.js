const mongoose = require('mongoose');

const repoReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    repoName: {
      type: String,
      required: true,
    },

    repoUrl: {
      type: String,
      required: true,
    },

    fileCount: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    architectureFeedback: [
      {
        type: String,
      },
    ],

    securityIssues: [
      {
        type: String,
      },
    ],

    performanceIssues: [
      {
        type: String,
      },
    ],

    suggestions: [
      {
        type: String,
      },
    ],

    summary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'RepoReview',
  repoReviewSchema
);