const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    bugs: [
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

    improvedCode: {
      type: String,
      default: '',
    },

    summary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Review', reviewSchema)