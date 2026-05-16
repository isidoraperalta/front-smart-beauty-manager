import { Navigate, Outlet } from 'react-router-dom'
import { authStorage } from '@/utils/auth'

export default function PublicOnlyRoute() {
  if (authStorage.isAuthenticated()) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}
