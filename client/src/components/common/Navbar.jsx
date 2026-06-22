import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/review', label: 'Review' },
    { to: '/history', label: 'History' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-dark-surface border-b border-dark-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to={user ? '/dashboard' : '/login'} className="flex items-center gap-2 no-underline">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#388BFD" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5" stroke="#388BFD" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="#388BFD" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
          <span className="font-mono font-semibold text-sm text-gray-200">
            code<span className="text-accent">review</span>.ai
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors no-underline ${
                  location.pathname === to
                    ? 'bg-dark-hover text-gray-200 font-medium'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-hover'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="w-px h-5 bg-dark-border mx-2" />
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-xs font-semibold text-accent font-mono">
              {user.name?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="ml-1 px-3 py-1.5 text-xs text-gray-400 border border-dark-border rounded-md hover:text-gray-200 hover:border-gray-500 transition-colors bg-transparent"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="px-4 py-1.5 text-sm text-gray-400 border border-dark-border rounded-md hover:text-gray-200 transition-colors no-underline">
              Log in
            </Link>
            <Link to="/register" className="px-4 py-1.5 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-md transition-colors no-underline">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}