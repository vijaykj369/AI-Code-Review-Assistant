const reviewCode = async ({ language, code }) => {
  return {
    score: 80,

    bugs: ['No major bugs detected'],

    securityIssues: [
      'No critical security issues found',
    ],

    performanceIssues: [
      'Consider optimizing loops for larger datasets',
    ],

    suggestions: [
      'Use meaningful variable names',
      'Add comments for complex logic',
      'Handle edge cases and invalid inputs',
    ],

    improvedCode: code,

    summary: `The ${language} code is functional and follows basic coding standards. Minor improvements can be made for readability and maintainability.`,
  };
};

// =========================
// REPOSITORY REVIEW
// =========================
const reviewRepository = async (files) => {
  return {
    score: 82,

    architectureFeedback: [
      'Project structure is organized and maintainable',
      'Controllers and services are separated correctly',
    ],

    securityIssues: [
      'No critical security issues found',
    ],

    performanceIssues: [
      'Consider caching expensive operations',
    ],

    suggestions: [
      'Add unit tests',
      'Improve documentation',
      'Increase error handling coverage',
    ],

    summary: `Repository contains ${files.length} supported source files and follows a clean architecture.`,
  };
};

module.exports = {
  reviewCode,
  reviewRepository,
};