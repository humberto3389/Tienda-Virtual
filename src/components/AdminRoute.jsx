import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, userRole } = useAuth()

  if (!user || userRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
} 