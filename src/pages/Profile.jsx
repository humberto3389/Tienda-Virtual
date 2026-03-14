import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/auth/AuthContext';
import { userService } from '../services/userService';
import { 
  UserCircleIcon, 
  Cog6ToothIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ChartBarIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const { profile, user, updatePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    title: '',
    phone: '',
    location: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nombre: profile.nombre || '',
        apellido: profile.apellido || '',
        title: profile.title || '',
        phone: profile.phone || '',
        location: profile.location || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await userService.updateUser(user.id, formData);
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) {
      return toast.error('La contraseña debe tener al menos 6 caracteres');
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('Las contraseñas no coinciden');
    }

    setLoading(true);
    try {
      await updatePassword(passwords.newPassword);
      toast.success('Contraseña actualizada correctamente');
      setShowPasswordModal(false);
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      toast.error('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/80 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/30 dark:border-gray-700/50 relative group">
        
        {/* Floating Particles Background */}
        <div className="absolute inset-0 opacity-10 dark:opacity-15">
          <div className="absolute w-48 h-48 bg-purple-400/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div className="absolute w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-1000" />
        </div>

        {/* Profile Header */}
        <div className="relative z-10">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')] opacity-10" />
            <div className="relative z-10">
              <div className="relative inline-block group">
                <div className="h-32 w-32 rounded-full border-4 border-white/20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-1 mx-auto overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <UserCircleIcon className="h-full w-full text-indigo-300 dark:text-gray-600" />
                  )}
                </div>
              </div>
              
              {isEditing ? (
                <div className="mt-6 flex flex-col items-center space-y-3">
                  <div className="flex space-x-2">
                    <input
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Nombre"
                      className="bg-white/20 border border-white/30 text-white placeholder-indigo-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
                    />
                    <input
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      placeholder="Apellido"
                      className="bg-white/20 border border-white/30 text-white placeholder-indigo-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
                    />
                  </div>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Título Profesional"
                    className="w-full max-w-xs bg-white/20 border border-white/30 text-indigo-100 placeholder-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
                  />
                </div>
              ) : (
                <>
                  <h1 className="mt-6 text-3xl font-bold text-white">{profile.nombre} {profile.apellido}</h1>
                  <p className="text-indigo-100/90 font-medium mt-2">{profile.title || 'Miembro de Yersiman'}</p>
                </>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Personal Info Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/50 dark:bg-gray-700/30 p-6 rounded-xl shadow-sm border border-white/30 dark:border-gray-600/30">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                  <LockClosedIcon className="h-6 w-6 text-indigo-600 dark:text-purple-400 mr-3" />
                  Información Personal
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-4" />
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500 dark:text-gray-300">Email</p>
                      <p className="text-gray-800 dark:text-white">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-4" />
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500 dark:text-gray-300">Teléfono</p>
                      {isEditing ? (
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white">{profile.phone || 'No especificado'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-4" />
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500 dark:text-gray-300">Ubicación</p>
                      {isEditing ? (
                        <input
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white">{profile.location || 'No especificado'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards (Mantenidos para diseño, podrían ser dinámicos luego) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Pedidos', value: '0', icon: ChartBarIcon },
                  { label: 'Deseos', value: '0', icon: ChartBarIcon },
                  { label: 'Reseñas', value: '0', icon: ChartBarIcon }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/50 dark:bg-gray-700/30 p-4 rounded-xl border border-white/30 dark:border-gray-600/30 hover:shadow-md transition-all group/stat">
                    <div className="flex items-center">
                      <stat.icon className="h-6 w-6 text-indigo-600 dark:text-purple-400 mr-3 group-hover/stat:scale-110 transition-transform" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{stat.label}</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <div className="bg-white/50 dark:bg-gray-700/30 p-6 rounded-xl shadow-sm border border-white/30 dark:border-gray-600/30">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                  <Cog6ToothIcon className="h-6 w-6 text-indigo-600 dark:text-purple-400 mr-3" />
                  Acciones
                </h2>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50"
                      >
                        <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-600/30 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors"
                      >
                        <span>Cancelar</span>
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-gray-600/30 text-indigo-600 dark:text-purple-400 hover:bg-indigo-100 dark:hover:bg-gray-600/50 transition-colors"
                    >
                      <span>Editar Perfil</span>
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-gray-600/30 text-indigo-600 dark:text-purple-400 hover:bg-indigo-100 dark:hover:bg-gray-600/50 transition-colors"
                  >
                    <span>Cambiar Contraseña</span>
                    <LockClosedIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Account Status Card */}
              <div className="bg-white/50 dark:bg-gray-700/30 p-6 rounded-xl border border-white/30 dark:border-gray-600/30">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 tracking-wider uppercase opacity-60">Status de la Cuenta</h3>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">ACTIVA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Edit Button (Only visible on hover when not editing) */}
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:rotate-12 backdrop-blur-md opacity-0 group-hover:opacity-100 border border-white/20"
          >
            <PencilSquareIcon className="h-6 w-6 text-indigo-600 dark:text-purple-400" />
          </button>
        )}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 p-8 transform animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Cambiar Contraseña</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-all"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-all"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50"
                >
                  {loading ? 'Cambiando...' : 'Cambiar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}