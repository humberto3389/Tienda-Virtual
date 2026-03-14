import { useAuth } from '../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState } from 'react'
import { EnvelopeIcon, LockClosedIcon, UserIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const [activeTab, setActiveTab] = useState('email');
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.nombre.trim() || !form.apellido.trim()) {
      setError('Nombre y apellido son obligatorios.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Correo electrónico inválido.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      await register({ nombre: form.nombre, apellido: form.apellido, email: form.email, password: form.password });
      navigate('/verify-email');
    } catch (err) {
      setError(err.message || 'Error al registrar.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      toast.success('Registro con Google exitoso.');
      navigate('/');
    } catch (err) {
      setError('Error al registrar con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-[#121212]' : 'bg-white font-light'}`}>
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
          <div className={`flex border-b ${darkMode ? 'border-gray-800' : 'border-gray-50'}`}>
            <button
              className={`flex-1 py-4 px-6 text-center font-light tracking-[0.2em] uppercase text-[10px] transition-all duration-300 ${activeTab === 'email' ? 'text-[#00E5FF] border-b-2 border-[#00E5FF]' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setActiveTab('email')}
            >
              EMAIL
            </button>
            <button
              className={`flex-1 py-4 px-6 flex items-center justify-center transition-all duration-300 border-b-2 ${activeTab === 'google' ? 'border-[#00E5FF]' : 'border-transparent'}`}
              onClick={() => setActiveTab('google')}
            >
              <img 
                className="h-4 w-4" 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google logo" 
              />
            </button>
          </div>
          <div className="p-8">
            <div className="text-center mb-10">
              <h1 className={`text-2xl tracking-tighter mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="font-light">Crear</span> <span className="font-semibold">cuenta</span>
              </h1>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-[1px] w-4 bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-1 w-1 rounded-full bg-[#00E5FF]"></div>
                <div className="h-[1px] w-4 bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </div>
            {activeTab === 'email' ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">Nombre</label>
                    <input name="nombre" value={form.nombre} onChange={handleChange} type="text" required className={`w-full px-5 py-3 rounded-full text-sm font-light border outline-none transition-all ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white focus:border-[#00E5FF]' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#00E5FF]'}`} placeholder="Juan" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">Apellido</label>
                    <input name="apellido" value={form.apellido} onChange={handleChange} type="text" required className={`w-full px-5 py-3 rounded-full text-sm font-light border outline-none transition-all ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white focus:border-[#00E5FF]' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#00E5FF]'}`} placeholder="Pérez" />
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">Correo electrónico</label>
                    <input name="email" value={form.email} onChange={handleChange} type="email" required className={`w-full px-5 py-3 rounded-full text-sm font-light border outline-none transition-all ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white focus:border-[#00E5FF]' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#00E5FF]'}`} placeholder="tu@email.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">Contraseña</label>
                    <div className="relative">
                      <input name="password" value={form.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} required className={`w-full px-5 py-3 rounded-full text-sm font-light border outline-none transition-all ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white focus:border-[#00E5FF]' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#00E5FF]'}`} placeholder="••••••••" />
                      <button type="button" className="absolute inset-y-0 right-0 pr-5 flex items-center" onClick={() => setShowPassword(v => !v)}>
                        {showPassword ? <EyeIcon className="h-4 w-4 text-gray-400" /> : <EyeIcon className="h-4 w-4 text-gray-400 opacity-50" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">Confirmar contraseña</label>
                    <div className="relative">
                      <input name="confirm" value={form.confirm} onChange={handleChange} type={showConfirm ? 'text' : 'password'} required className={`w-full px-5 py-3 rounded-full text-sm font-light border outline-none transition-all ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white focus:border-[#00E5FF]' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#00E5FF]'}`} placeholder="••••••••" />
                      <button type="button" className="absolute inset-y-0 right-0 pr-5 flex items-center" onClick={() => setShowConfirm(v => !v)}>
                        {showConfirm ? <EyeIcon className="h-4 w-4 text-gray-400" /> : <EyeIcon className="h-4 w-4 text-gray-400 opacity-50" />}
                      </button>
                    </div>
                  </div>
                </div>
                {error && <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-xl p-3 text-red-700 dark:text-red-300 text-sm">{error}</div>}
                <div className="pt-6">
                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center px-10 py-4 rounded-full bg-[#37383F] text-white text-[10px] tracking-[0.2em] font-medium hover:bg-[#2a2b30] transition-all disabled:opacity-50">
                    {loading ? 'REGISTRANDO...' : 'CREAR CUENTA'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 pt-6">
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-3 px-10 py-4 rounded-full border text-[10px] tracking-[0.2em] font-medium transition-all ${darkMode ? 'border-gray-800 bg-gray-800/30 text-white hover:bg-gray-800' : 'border-gray-100 bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
                >
                  <img className="h-4 w-4" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
                  {loading ? 'PROCESANDO...' : 'CON GOOGLE'}
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${darkMode ? 'border-gray-800' : 'border-gray-50'}`} />
                  </div>
                  <div className="relative flex justify-center text-[10px] tracking-widest uppercase">
                    <span className={`px-4 ${darkMode ? 'bg-[#121212]' : 'bg-white'} opacity-30`}>O usa tu email</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('email')}
                  className="w-full text-center text-[10px] tracking-widest uppercase text-[#00E5FF] hover:underline"
                >
                  VOLVER AL FORMULARIO
                </button>
              </div>
            )}
            <div className="mt-12 text-center">
              <p className="text-[10px] tracking-widest uppercase opacity-40 mb-3">¿Ya tienes una cuenta?</p>
              <Link to="/login" className="text-xs font-medium text-[#00E5FF] hover:underline tracking-widest uppercase">
                Inicia sesión aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}