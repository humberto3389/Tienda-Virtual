import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/auth/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPasswordForEmail } = useAuth()
  const { darkMode } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPasswordForEmail(email)
      setSent(true)
      toast.success('Correo de recuperación enviado')
    } catch (error) {
      console.error('Error al enviar correo:', error)
      toast.error(error.message || 'Error al enviar el correo de recuperación')
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
                <span className="font-light">Recuperar</span> <span className="font-semibold">contraseña</span>
              </h1>
              <p className="text-[10px] tracking-widest uppercase opacity-40 mt-4 px-4 leading-relaxed">
                Ingresa tu email y te enviaremos un enlace para restablecer tu cuenta.
              </p>
              <div className="flex items-center justify-center space-x-2 mt-6">
                <div className="h-[1px] w-4 bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-1 w-1 rounded-full bg-[#00E5FF]"></div>
                <div className="h-[1px] w-4 bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </div>

            {sent ? (
              <div className="text-center space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl p-6">
                  <EnvelopeIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-xs text-green-700 dark:text-green-400 font-light leading-relaxed">
                    Hemos enviado un enlace a <span className="font-semibold">{email}</span>. Revisa tu bandeja de entrada y spam.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center text-[10px] tracking-widest uppercase text-[#00E5FF] hover:underline"
                >
                  <ArrowLeftIcon className="h-3 w-3 mr-2" />
                  Volver al inicio de sesión
                </Link>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase opacity-40 mb-3">
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

                <div className="space-y-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center px-10 py-4 rounded-full bg-[#37383F] text-white text-[10px] tracking-[0.2em] font-medium hover:bg-[#2a2b30] transition-all disabled:opacity-50 shadow-xl shadow-gray-200 dark:shadow-none"
                  >
                    {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
                  </button>
                  
                  <Link
                    to="/login"
                    className="w-full block text-center text-[10px] tracking-widest uppercase text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Cancelar
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
