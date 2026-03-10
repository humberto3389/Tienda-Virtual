import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AdminRoute({ children }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" color="gradient" />
      </div>
    );
  }

  if (!profile?.role?.includes('admin')) {
    return <Navigate to="/login" replace />;
  }

  return children;
}