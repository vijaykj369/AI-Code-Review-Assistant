import { Link } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#388BFD" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="#388BFD" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-200 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}