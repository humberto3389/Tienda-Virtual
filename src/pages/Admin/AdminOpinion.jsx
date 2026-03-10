import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { opinionService } from '../../services/opinionService';
import { useAuth } from '../../context/auth/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const AdminOpinion = () => {
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadOpinions();
  }, [activeTab]);

  const loadOpinions = async () => {
    try {
      setLoading(true);
      const data = await opinionService.getAdminOpinions({ status: activeTab });
      setOpinions(data);
    } catch (err) {
      console.error('Error loading opinions:', err);
      setError('Error al cargar las opiniones');
      toast.error('Error al cargar las opiniones');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (opinionId, newStatus) => {
    try {
      const updatedOpinion = await opinionService.updateOpinionStatus(opinionId, newStatus);
      
      if (!updatedOpinion) {
        throw new Error('No se recibió la opinión actualizada');
      }
  
      toast.success(`Opinión ${newStatus === 'approved' ? 'aprobada' : 'rechazada'} correctamente`);
      
      // Recargar las opiniones para asegurar que tenemos los datos actualizados
      await loadOpinions();
      
    } catch (err) {
      console.error('Error updating opinion status:', err);
      toast.error(err.message || 'Error al actualizar el estado de la opinión');
    }
  };

  if (!profile?.role?.includes('admin')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-200">No tienes permiso para ver esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administración de Opiniones</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['pending', 'approved', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner size="lg" color="gradient" />
              </div>
            ) : error ? (
              <div className="text-red-600 dark:text-red-400 py-4 text-center">{error}</div>
            ) : (
              <div className="space-y-6">
                {opinions.map((opinion) => (
                  <div key={opinion.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={opinion.avatar || 'https://via.placeholder.com/40x40'}
                          alt={opinion.nombre}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {opinion.nombre}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {opinion.created_at ? new Date(opinion.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Fecha no disponible'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {activeTab !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(opinion.id, 'approved')}
                            className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                          >
                            Aprobar
                          </button>
                        )}
                        {activeTab !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(opinion.id, 'rejected')}
                            className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                          >
                            Rechazar
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        Producto: {opinion.producto}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">{opinion.mensaje}</p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`h-5 w-5 ${i < opinion.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {opinions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No hay opiniones {activeTab === 'pending' ? 'pendientes' : activeTab === 'approved' ? 'aprobadas' : 'rechazadas'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOpinion;