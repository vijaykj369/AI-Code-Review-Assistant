import { useState } from 'react'
import Button from '../common/Button'

export default function RepoInput({ onReview, loading }) {
  const [url, setUrl] = useState('')
  const [branch, setBranch] = useState('main')
  const [error, setError] = useState('')

  const validateUrl = (u) => /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/.test(u)

  const handleSubmit = () => {
    if (!validateUrl(url)) return setError('Please enter a valid GitHub repository URL')
    setError('')
    onReview({ url, branch })
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">GitHub repository URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError('') }}
          placeholder="https://github.com/username/repository"
          className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent transition-colors font-mono"
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Branch</label>
        <input
          type="text"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          placeholder="main"
          className="w-48 bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent transition-colors font-mono"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-gray-600">Only public repositories are supported.</p>
        <Button onClick={handleSubmit} loading={loading} disabled={!url.trim()}>
          {loading ? 'Analyzing...' : 'Analyze repo →'}
        </Button>
      </div>
    </div>
  )
}