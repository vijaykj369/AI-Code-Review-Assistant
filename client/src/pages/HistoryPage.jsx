import { useState, useEffect } from 'react';
import ReviewHistoryList from '../components/review/ReviewHistoryList';
import { reviewService } from '../services/reviewService';
import { repoService } from '../services/repoService';

export default function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      try {
        // ✅ Code reviews (paginated)
        const reviewRes = await reviewService.getHistory({
          page,
          limit: 10,
        });

        // ✅ Repo reviews (only first page to avoid duplication)
        const repoRes =
          page === 1
            ? await repoService.getRepoHistory()
            : [];

        // ✅ Merge safely
        const merged = [
          ...(reviewRes.reviews || []),
          ...(repoRes || []),
        ];

        // ✅ Sort by latest
        merged.sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

        // ✅ FIX: avoid stale state bug
        setReviews((prev) =>
          page === 1
            ? merged
            : [...prev, ...(reviewRes.reviews || [])]
        );

        // ✅ Only rely on code API pagination
        setHasMore(reviewRes.hasMore || false);
      } catch (err) {
        console.error('History error:', err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [page]);

  // =========================
  // DELETE HANDLER (CODE + REPO)
  // =========================
  const handleDelete = async (review) => {
    try {
      // detect type safely
      if (review.repoName) {
        await repoService.deleteRepoReview(review._id);
      } else {
        await reviewService.deleteReview(review._id);
      }

      setReviews((prev) =>
        prev.filter((r) => r._id !== review._id)
      );
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-200 mb-1">
          Review History
        </h1>

        <p className="text-sm text-gray-500">
          Code reviews and repository reviews.
        </p>
      </div>

      <ReviewHistoryList
        reviews={reviews}
        loading={loading}
        onDelete={handleDelete}
      />

      {hasMore && !loading && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="text-sm text-accent hover:underline"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}