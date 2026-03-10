import { useState, useEffect } from 'react';
import { newsletterService } from '../../services/newsletterService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import {
  EnvelopeIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const { success, data, message } = await newsletterService.getSubscribers();
      if (success) {
        setSubscribers(data);
      } else {
        toast.error(message || 'Error al cargar suscriptores');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      const { success, message } = await newsletterService.deleteSubscriber(id);
      if (success) {
        toast.success(message);
        setSubscribers(prev => prev.filter(s => s.id !== id));
        setSelectedSubscriber(null);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" color="gradient" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Suscriptores <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Newsletter</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Gestiona la lista de correos registrados para novedades
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between gap-8">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Suscriptores</p>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{subscribers.length}</p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100 dark:bg-gray-700">
                  <UserGroupIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </div>
            
            <div className="relative w-full lg:w-80">
              <input
                type="text"
                placeholder="Buscar por email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            <button 
              onClick={loadSubscribers}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              title="Actualizar lista"
            >
              <ArrowPathIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Desktop Table Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Registro</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 transition-all">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 mr-3 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                          <EnvelopeIcon className="w-5 h-5" />
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(subscriber.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => setSelectedSubscriber(subscriber)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Eliminar suscriptor"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubscribers.length === 0 && (
            <div className="py-20 text-center">
              <EnvelopeIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No se encontraron coincidencias' : 'No hay suscriptores registrados'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedSubscriber && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => !isDeleting && setSelectedSubscriber(null)}>
              <div className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-gray-200 dark:border-gray-700">
              <div className="p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-6">
                  <TrashIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">Confirmar Acción</h3>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
                  ¿Estás seguro que deseas eliminar a <span className="font-semibold">{selectedSubscriber.email}</span> de la lista de suscriptores?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedSubscriber(null)}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDelete(selectedSubscriber.id)}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-all flex items-center justify-center"
                  >
                    {isDeleting ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      'Eliminar'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
