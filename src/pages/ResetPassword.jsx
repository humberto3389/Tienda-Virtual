import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/auth/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const { darkMode } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password.length < 6) {
      return toast.error('La contraseña debe tener al menos 6 caracteres')
    }
    if (password !== confirmPassword) {
      return toast.error('Las contraseñas no coinciden')
    }

    setLoading(true)
    try {
      await updatePassword(password)
      toast.success('Contraseña restablecida con éxito')
      navigate('/login')
    } catch (error) {
      console.error('Error al restablecer contraseña:', error)
      toast.error(error.message || 'Error al restablecer la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-[#121212]' : 'bg-white font-light'}`}>
      <div className="w-full max-w-md">
        <div className={`rounded-3xl shadow-2xl overflow-hidden border ${darkMode ? 'bg-gray-800/20 border-gray-800/50' : 'bg-white border-gray-100'}`}>
          <div className="p-10">
            <div className="text-center mb-10">
              <h1 className={`text-2xl tracking-tighter mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="font-light">Nueva</span> <span className="font-semibold">contraseña</span>
              </h1>
              <p className="text-[10px] tracking-widest uppercase opacity-40 mt-4 px-4 leading-relaxed">
                Elige una contraseña segura para proteger tu cuenta de Yersiman.
              </p>
              <div className="flex items-center justify-center space-x-2 mt-6">
                <div className="h-[1px] w-4 bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-1 w-1 rounded-full bg-[#00E5FF]"></div>
                <div className="h-[1px] w-4 bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">
                    Nueva contraseña
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

                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase opacity-40 mb-2">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-6 py-4 rounded-full text-sm font-light border outline-none transition-all ${
                      darkMode 
                        ? 'bg-gray-800/50 border-gray-700 text-white focus:border-[#00E5FF]' 
                        : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#00E5FF]'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-10 py-4 rounded-full bg-[#37383F] text-white text-[10px] tracking-[0.2em] font-medium hover:bg-[#2a2b30] transition-all disabled:opacity-50 shadow-xl shadow-gray-200 dark:shadow-none"
                >
                  {loading ? 'RESTABLECIENDO...' : 'RESTABLECER CONTRASEÑA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
