import { useState } from 'react';
import RepoInput from '../components/repo/RepoInput';
import Loader from '../components/common/Loader';
import api from '../services/api';

export default function RepoReviewPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleRepoReview = async ({ url }) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/repo/review', {
        repoUrl: url,
      });

      setResult(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to review repository'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-200 mb-1">
          Repository Review
        </h1>

        <p className="text-sm text-gray-500">
          Enter a GitHub repository URL to analyze the repository.
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <RepoInput onReview={handleRepoReview} loading={loading} />

      {loading && (
        <div className="mt-8">
          <Loader text="Analyzing repository..." />
        </div>
      )}

      {result && !loading && (
        <div className="mt-6 bg-dark-surface border border-dark-border rounded-xl p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-200">
              {result.repoName}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Files analyzed: {result.fileCount}
            </p>

            <p className="text-sm text-gray-500">
              Repository Score:{' '}
              <span className="font-semibold text-green-400">
                {result.score}/100
              </span>
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-200 mb-2">
              Summary
            </h3>

            <p className="text-sm text-gray-400">
              {result.summary}
            </p>
          </div>

          {result.architectureFeedback?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-200 mb-2">
                Architecture Feedback
              </h3>

              <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                {result.architectureFeedback.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {result.securityIssues?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-200 mb-2">
                Security Issues
              </h3>

              <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                {result.securityIssues.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {result.performanceIssues?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-200 mb-2">
                Performance Issues
              </h3>

              <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                {result.performanceIssues.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions?.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-200 mb-2">
                Suggestions
              </h3>

              <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                {result.suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}