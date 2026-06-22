const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
]

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 font-medium">Language</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-dark-hover border border-dark-border rounded-md px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-accent cursor-pointer"
      >
        {LANGUAGES.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  )
}

export { LANGUAGES }