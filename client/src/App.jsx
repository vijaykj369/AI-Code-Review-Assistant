import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/common/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ReviewPage from './pages/ReviewPage'
import RepoReviewPage from './pages/RepoReviewPage'
import HistoryPage from './pages/HistoryPage'
import ReviewDetailPage from './pages/ReviewDetailPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <>
      <Navbar />
   <Routes>
  <Route
    path="/login"
    element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
  />

  <Route
    path="/register"
    element={user ? <Navigate to="/dashboard" /> : <RegisterPage />}
  />

  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    }
  />

  <Route
    path="/review"
    element={
      <PrivateRoute>
        <ReviewPage />
      </PrivateRoute>
    }
  />

  <Route
    path="/repo"
    element={
      <PrivateRoute>
        <RepoReviewPage />
      </PrivateRoute>
    }
  />

  <Route
    path="/history"
    element={
      <PrivateRoute>
        <HistoryPage />
      </PrivateRoute>
    }
  />

  <Route
    path="/history/:id"
    element={
      <PrivateRoute>
        <ReviewDetailPage />
      </PrivateRoute>
    }
  />

  <Route
    path="*"
    element={
      <Navigate
        to={user ? '/dashboard' : '/login'}
      />
    }
  />
</Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}