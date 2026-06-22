export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

export const scoreLabel = (score) => {
  if (score >= 90) return { label: 'Excellent', color: '#3FB950' }
  if (score >= 75) return { label: 'Good', color: '#56D364' }
  if (score >= 60) return { label: 'Fair', color: '#D29922' }
  if (score >= 40) return { label: 'Needs work', color: '#F0883E' }
  return { label: 'Poor', color: '#F85149' }
}

export const truncate = (str, n = 120) =>
  str?.length > n ? str.slice(0, n) + '...' : str

export const capitalize = (s) => s ? s[0].toUpperCase() + s.slice(1) : ''