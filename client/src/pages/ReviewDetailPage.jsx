import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { reviewService } from '../services/reviewService';
import { repoService } from '../services/repoService';

export default function ReviewDetailPage() {
  const { id } = useParams();

  const [review, setReview] = useState(null);
  const [isRepoReview, setIsRepoReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        // Try normal code review first
        const codeReview =
          await reviewService.getReviewById(id);

        setReview(codeReview);
        setIsRepoReview(false);
      } catch {
        try {
          // If not found, try repo review
          const repoReview =
            await repoService.getRepoReviewById(id);

          setReview(repoReview);
          setIsRepoReview(true);
        } catch (err) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-gray-400">
          Loading review...
        </p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-red-400">
          Review not found
        </p>
      </div>
    );
  }

  const scoreColor =
    review.score >= 80
      ? 'text-green-400'
      : review.score >= 60
      ? 'text-yellow-400'
      : 'text-red-400';

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          {isRepoReview
            ? 'Repository Review'
            : 'Code Review'}
        </h1>

        <p className="text-gray-500">
          Created on{' '}
          {new Date(
            review.createdAt
          ).toLocaleString()}
        </p>
      </div>

      {/* SCORE */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-5 mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Review Score
        </p>

        <p
          className={`text-4xl font-bold font-mono ${scoreColor}`}
        >
          {review.score}/100
        </p>
      </div>

      {/* REPO INFO */}
      {isRepoReview && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Repository Information
          </h2>

          <p className="text-gray-300 mb-2">
            <strong>Name:</strong>{' '}
            {review.repoName}
          </p>

          <p className="text-gray-300 mb-2">
            <strong>URL:</strong>{' '}
            {review.repoUrl}
          </p>

          <p className="text-gray-300">
            <strong>Files:</strong>{' '}
            {review.fileCount}
          </p>
        </div>
      )}

      {/* SUMMARY */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Summary
        </h2>

        <p className="text-gray-300 whitespace-pre-wrap">
          {review.summary || 'No summary'}
        </p>
      </div>

      {/* ORIGINAL CODE */}
      {!isRepoReview && review.code && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Original Code
          </h2>

          <pre className="overflow-auto text-sm text-green-300 bg-black/40 p-4 rounded-lg">
            {review.code}
          </pre>
        </div>
      )}

      {/* IMPROVED CODE */}
      {!isRepoReview &&
        review.improvedCode && (
          <div className="bg-dark-surface border border-dark-border rounded-xl p-5 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Improved Code
            </h2>

            <pre className="overflow-auto text-sm text-cyan-300 bg-black/40 p-4 rounded-lg">
              {review.improvedCode}
            </pre>
          </div>
        )}

      {/* BUGS */}
      {!isRepoReview &&
        review.bugs?.length > 0 && (
          <div className="bg-dark-surface border border-dark-border rounded-xl p-5 mb-6">
            <h2 className="text-lg font-semibold text-red-400 mb-4">
              Bugs Found
            </h2>

            <ul className="space-y-2">
              {review.bugs.map((bug, i) => (
                <li
                  key={i}
                  className="text-gray-300"
                >
                  • {bug}
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* ARCHITECTURE */}
      {isRepoReview &&
        review.architectureFeedback?.length >
          0 && (
          <div className="bg-dark-surface border border-dark-border rounded-xl p-5 mb-6">
            <h2 className="text-lg font-semibold text-purple-400 mb-4">
              Architecture Feedback
            </h2>

            <ul className="space-y-2">
              {review.architectureFeedback.map(
                (item, i) => (
                  <li
                    key={i}
                    className="text-gray-300"
                  >
                    • {item}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

      {/* SECURITY */}
      {review.securityIssues?.length > 0 && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5 mb-6">
          <h2 className="text-lg font-semibold text-yellow-400 mb-4">
            Security Issues
          </h2>

          <ul className="space-y-2">
            {review.securityIssues.map(
              (item, i) => (
                <li
                  key={i}
                  className="text-gray-300"
                >
                  • {item}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* PERFORMANCE */}
      {review.performanceIssues?.length >
        0 && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5 mb-6">
          <h2 className="text-lg font-semibold text-orange-400 mb-4">
            Performance Issues
          </h2>

          <ul className="space-y-2">
            {review.performanceIssues.map(
              (item, i) => (
                <li
                  key={i}
                  className="text-gray-300"
                >
                  • {item}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* SUGGESTIONS */}
      {review.suggestions?.length > 0 && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-green-400 mb-4">
            Suggestions
          </h2>

          <ul className="space-y-2">
            {review.suggestions.map(
              (item, i) => (
                <li
                  key={i}
                  className="text-gray-300"
                >
                  • {item}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}