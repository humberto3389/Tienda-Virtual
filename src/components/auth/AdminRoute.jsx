import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Verificar si el usuario está autenticado y tiene rol de administrador
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}