import { useNavigate } from 'react-router-dom';

const scoreColor = (s) =>
  s >= 80
    ? 'text-green-400'
    : s >= 60
    ? 'text-yellow-400'
    : 'text-red-400';

export default function ReviewCard({ review, onDelete }) {
  const navigate = useNavigate();

  const {
    _id,
    language,
    repoName,
    score,
    summary,
    createdAt,
  } = review;

  const date = new Date(createdAt).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  const isRepo = !!repoName;

  return (
    <div
      onClick={() => navigate(`/history/${_id}`)}
      className="bg-dark-surface border border-dark-border rounded-xl p-4 cursor-pointer hover:border-gray-500 hover:bg-dark-hover transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        {/* LEFT */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-dark-border text-accent bg-accent/10">
              {isRepo ? 'repo' : language}
            </span>

            <span className="text-xs text-gray-600">
              {date}
            </span>
          </div>

          {/* Repo name if exists */}
          {isRepo && (
            <p className="text-xs text-gray-500 mb-1 font-mono">
              {repoName}
            </p>
          )}

          <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
            {summary}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-end gap-2">
          <div
            className={`text-xl font-bold font-mono ${scoreColor(
              score
            )}`}
          >
            {score}
          </div>

          {/* DELETE BUTTON (NOW ALWAYS SHOWS) */}
          <button
            onClick={(e) => {
              e.stopPropagation();

              onDelete(review);
            }}
            className="text-xs text-red-500 hover:text-red-400 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}