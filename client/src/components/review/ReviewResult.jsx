function ScoreMeter({ score }) {
  const percentage = score * 10

  const color =
    percentage >= 80
      ? '#3FB950'
      : percentage >= 60
      ? '#D29922'
      : '#F85149'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 80 80" className="w-20 h-20">
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="#30363D"
          strokeWidth="6"
        />

        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${(percentage / 100) * 213.6} 213.6`}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />

        <text
          x="40"
          y="45"
          textAnchor="middle"
          fontSize="18"
          fontWeight="600"
          fill={color}
          fontFamily="monospace"
        >
          {score}
        </text>
      </svg>

      <span className="text-xs text-gray-500">
        AI Score
      </span>
    </div>
  )
}

export default function ReviewResult({ result }) {
  if (!result) return null

  const {
    score,
    summary,
    bugs = [],
    securityIssues = [],
    performanceIssues = [],
    suggestions = [],
    improvedCode = '',
    language = '',
  } = result

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-5 flex justify-between gap-4">

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 rounded border border-dark-border text-xs text-accent">
              {language}
            </span>

            <span className="text-xs text-gray-500">
              AI Review Complete
            </span>
          </div>

          <p className="text-sm text-gray-300">
            {summary}
          </p>
        </div>

        <ScoreMeter score={score} />
      </div>

      {/* Bugs */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
        <h3 className="text-red-400 font-medium mb-3">
          Bugs
        </h3>

        {bugs.length ? (
          <ul className="space-y-2">
            {bugs.map((bug, index) => (
              <li
                key={index}
                className="text-sm text-gray-300"
              >
                • {bug}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No bugs detected.
          </p>
        )}
      </div>

      {/* Security */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
        <h3 className="text-yellow-400 font-medium mb-3">
          Security Issues
        </h3>

        {securityIssues.length ? (
          <ul className="space-y-2">
            {securityIssues.map((issue, index) => (
              <li
                key={index}
                className="text-sm text-gray-300"
              >
                • {issue}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No security issues found.
          </p>
        )}
      </div>

      {/* Performance */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
        <h3 className="text-blue-400 font-medium mb-3">
          Performance Issues
        </h3>

        {performanceIssues.length ? (
          <ul className="space-y-2">
            {performanceIssues.map((issue, index) => (
              <li
                key={index}
                className="text-sm text-gray-300"
              >
                • {issue}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No performance issues found.
          </p>
        )}
      </div>

      {/* Suggestions */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
        <h3 className="text-green-400 font-medium mb-3">
          Suggestions
        </h3>

        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="text-sm text-gray-300"
            >
              • {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* Improved Code */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
        <h3 className="text-accent font-medium mb-3">
          Improved Code
        </h3>

        <pre className="overflow-auto bg-dark-bg p-4 rounded-lg text-sm font-mono text-gray-300 whitespace-pre-wrap">
          {improvedCode}
        </pre>
      </div>

    </div>
  )
}