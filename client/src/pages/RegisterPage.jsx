import { Link } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#388BFD" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="#388BFD" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-200 mb-1">Create an account</h1>
          <p className="text-sm text-gray-500">Start reviewing code with AI</p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}