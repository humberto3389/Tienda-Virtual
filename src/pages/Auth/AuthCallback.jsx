import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error al verificar sesión:', error);
        navigate('/login');
      } else if (session) {
        navigate('/');
      }
    };

    checkSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-6 max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <ArrowPathIcon className="animate-spin h-12 w-12 mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Verificando autenticación...
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Serás redirigido automáticamente.
        </p>
      </div>
    </div>
  );
}