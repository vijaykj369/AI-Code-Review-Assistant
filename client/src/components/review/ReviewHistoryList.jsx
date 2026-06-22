import ReviewCard from './ReviewCard';
import Loader from '../common/Loader';

export default function ReviewHistoryList({ reviews, loading, onDelete }) {
  if (loading)
    return (
      <div className="py-12">
        <Loader text="Loading reviews..." />
      </div>
    );

  if (!reviews?.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 text-sm">No reviews yet.</p>
        <p className="text-gray-600 text-xs mt-1">
          Paste some code and hit Review to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}