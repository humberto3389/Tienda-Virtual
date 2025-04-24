import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { UserCircleIcon, DevicePhoneMobileIcon, HomeModernIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile(user.id)
        setProfile(data)
      } catch (error) {
        console.error('Error al cargar perfil:', error)
        toast.error('Error al cargar el perfil')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(e.target)
      const profileData = {
        full_name: formData.get('full_name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        updated_at: new Date()
      }

      await userService.updateProfile(user.id, profileData)
      toast.success('Perfil actualizado correctamente')
      
      // Recargar el perfil
      const updatedProfile = await userService.getProfile(user.id)
      setProfile(updatedProfile)
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      toast.error('Error al actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header con foto de perfil */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center">
              <UserCircleIcon className="h-16 w-16 text-white" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Mi Perfil</h1>
            <p className="text-indigo-100">Administra tu información personal</p>
          </div>

          {/* Formulario */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user?.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  defaultValue={profile?.full_name}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={profile?.phone}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  defaultValue={profile?.address}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>

          {/* Sección adicional */}
          <div className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Tus datos están protegidos bajo nuestra política de privacidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}