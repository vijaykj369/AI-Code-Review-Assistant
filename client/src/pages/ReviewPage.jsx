import { useState } from 'react'
import CodeEditor from '../components/editor/CodeEditor'
import ReviewResult from '../components/review/ReviewResult'
import { useReview } from '../hooks/useReview'
import Button from '../components/common/Button'

export default function ReviewPage() {
  const { result, loading, error, submitReview, reset } = useReview()

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-200 mb-1">Code Review</h1>
        <p className="text-sm text-gray-500">Paste your code below and get an instant AI-powered review.</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {!result ? (
        <CodeEditor onReview={submitReview} loading={loading} />
      ) : (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-medium text-gray-300">Review results</h2>
            <Button variant="secondary" onClick={reset} size="sm">← Review another</Button>
          </div>
          <ReviewResult result={result} />
        </div>
      )}
    </div>
  )
}