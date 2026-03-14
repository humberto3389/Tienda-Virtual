import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../context/auth/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('email')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()
  const { darkMode } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Correo electrónico inválido.')
      return
    }
    if (!password) {
      setError('La contraseña es obligatoria.')
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Bienvenido de vuelta')
      navigate('/')
    } catch (error) {
      setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (error) {
      setError('Error al iniciar sesión con Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-[#121212]' : 'bg-white font-light'}`}>
      <div className="w-full max-w-md">
        <div className={`rounded-3xl shadow-2xl overflow-hidden border ${darkMode ? 'bg-gray-800/20 border-gray-800/50' : 'bg-white border-gray-100'}`}>
          <div className={`flex border-b ${darkMode ? 'border-gray-800' : 'border-gray-50'}`}>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-4 px-6 text-center font-light tracking-[0.2em] uppercase text-[10px] transition-all duration-300 ${
                activeTab === 'email'
                  ? 'text-[#00E5FF] border-b-2 border-[#00E5FF]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              EMAIL
            </button>
            <button
              onClick={() => setActiveTab('google')}
              className={`flex-1 py-4 px-6 flex items-center justify-center transition-all duration-300 border-b-2 ${
                activeTab === 'google'
                  ? 'border-[#00E5FF]'
                  : 'border-transparent'
              }`}
            >
              <img
                className="h-4 w-4"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
              />
            </button>
          </div>

          <div className="p-10">
            <div className="text-center mb-10">
              <h1 className={`text-2xl tracking-tighter mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="font-light">Bienvenido de</span> <span className="font-semibold">vuelta</span>
              </h1>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-[1px] w-4 bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-1 w-1 rounded-full bg-[#00E5FF]"></div>
                <div className="h-[1px] w-4 bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </div>

            {activeTab === 'email' ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-6 py-4 rounded-full text-sm font-light border outline-none transition-all ${
                        darkMode 
                          ? 'bg-gray-800/50 border-gray-700 text-white focus:border-[#00E5FF]' 
                          : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#00E5FF]'
                      }`}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-6 py-4 rounded-full text-sm font-light border outline-none transition-all ${
                          darkMode 
                            ? 'bg-gray-800/50 border-gray-700 text-white focus:border-[#00E5FF]' 
                            : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#00E5FF]'
                        }`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-6 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-3 w-3 text-[#00E5FF] focus:ring-[#00E5FF] border-gray-300 rounded-full"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-[10px] uppercase tracking-widest opacity-40">
                      Recordarme
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-[10px] uppercase tracking-widest text-[#00E5FF] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 text-center">
                    <p className="text-xs text-red-600 dark:text-red-400 font-light">{error}</p>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center px-10 py-4 rounded-full bg-[#37383F] text-white text-[10px] tracking-[0.2em] font-medium hover:bg-[#2a2b30] transition-all disabled:opacity-50"
                  >
                    {loading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 pt-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-3 px-10 py-4 rounded-full border text-[10px] tracking-[0.2em] font-medium transition-all ${
                    darkMode 
                      ? 'border-gray-800 bg-gray-800/30 text-white hover:bg-gray-800' 
                      : 'border-gray-100 bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <img
                    className="h-4 w-4"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google logo"
                  />
                  {loading ? 'CARGANDO...' : 'CON GOOGLE'}
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
              <p className="text-[10px] tracking-widest uppercase opacity-40 mb-3">¿No tienes una cuenta?</p>
              <Link
                to="/register"
                className="text-xs font-medium text-[#00E5FF] hover:underline tracking-widest uppercase"
              >
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}