import { useState, useCallback } from 'react'
import { reviewService } from '../services/reviewService'

export function useReview() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submitReview = useCallback(async ({ code, language }) => {
    try {
      setLoading(true)
      setError(null)

      const review = await reviewService.reviewCode(
        code,
        language
      )

      setResult(review)

      return review
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Review failed'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    result,
    loading,
    error,
    submitReview,
    reset,
  }
}