import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from '../components/ui/Loader'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth()
  const location = useLocation()

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader label="Checking your session" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
