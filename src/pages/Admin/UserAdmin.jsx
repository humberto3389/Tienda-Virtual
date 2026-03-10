import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
  UserIcon,
  ShieldCheckIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError(error.message);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
  try {
    setIsDeleting(true);
    await userService.deleteUser(userId);
    
    // Actualización optimista del estado local
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    
    toast.success('Usuario eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    toast.error(error.message || 'Error al eliminar usuario');
    
    // Si hay error, recargamos los usuarios para sincronizar
    loadUsers();
  } finally {
    setIsDeleting(false);
    setSelectedUser(null);
  }
};

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      toast.success('Rol actualizado exitosamente');
      loadUsers();
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      toast.error('Error al actualizar rol');
    }
  };

  const filteredUsers = users.filter(user => 
    `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" color="gradient" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl">
          <div className="text-red-500 dark:text-red-400 text-lg font-medium">{error}</div>
          <button 
            onClick={loadUsers}
            className="mt-4 flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con estadísticas */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Gestión de Usuarios
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Administra los usuarios del sistema
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex-1 min-w-[200px] border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Usuarios</p>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{users.length}</p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100 dark:bg-gray-700">
                  <UsersIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </div>
            
            <div className="relative w-full lg:w-64">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm"
              />
              <div className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de usuarios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div 
              key={user.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700
                ${hoveredUser === user.id ? 'ring-2 ring-indigo-500' : ''}`}
              onMouseEnter={() => setHoveredUser(user.id)}
              onMouseLeave={() => setHoveredUser(null)}
            >
              {/* Fondo degradado según rol */}
              <div className={`absolute top-0 left-0 right-0 h-2 ${user.role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}></div>
              
              <div className="p-6 pt-8">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                      src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=random`}
                      alt={`${user.nombre} ${user.apellido}`}
                    />
                    {hoveredUser === user.id && user.id !== profile?.id && (
                      <div className="absolute -bottom-2 -right-2 flex space-x-1">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                    {user.nombre} {user.apellido}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                    {user.email}
                  </p>
                  
                  <div className="mt-4 flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    className={`text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      user.role === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowCreateModal(true);
                      }}
                      className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                      title="Editar"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mensaje cuando no hay resultados */}
        {filteredUsers.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md">
              <UserIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron usuarios
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? 
                  `No hay coincidencias para "${searchTerm}"` : 
                  'No hay usuarios registrados en el sistema'}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
                >
                  Limpiar búsqueda
                </button>
              ) : (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center"
                >
                  <UserPlusIcon className="w-5 h-5 mr-2" />
                  Agregar usuario
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación personalizado */}
      {selectedUser && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 bg-opacity-75 dark:bg-opacity-90 transition-opacity"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="p-6 text-center">
                <TrashIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Confirmar eliminación
                </h3>
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    ¿Estás seguro de eliminar permanentemente a <span className="font-semibold">{selectedUser.nombre} {selectedUser.apellido}</span>?
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Esta acción eliminará todos los datos del usuario y no se podrá deshacer.
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      await handleDeleteUser(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    disabled={isDeleting}
                    className={`px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-colors duration-200 ${
                      isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isDeleting ? (
                      <div className="flex items-center justify-center">
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                        Eliminando...
                      </div>
                    ) : (
                      'Eliminar permanentemente'
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