import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  UserCircleIcon, 
  Cog6ToothIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ChartBarIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const [userData] = useState({
    name: 'Alexandra Smith',
    title: 'Senior Product Designer',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    stats: {
      projects: 42,
      contributions: 128,
      efficiency: '98%'
    }
  });

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
                  <UserCircleIcon className="h-full w-full text-indigo-300 dark:text-gray-600" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <PencilSquareIcon className="h-5 w-5 text-indigo-600 dark:text-purple-400" />
                </button>
              </div>
              <h1 className="mt-6 text-3xl font-bold text-white">{userData.name}</h1>
              <p className="text-indigo-100/90 font-medium mt-2">{userData.title}</p>
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
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Email</p>
                      <p className="text-gray-800 dark:text-white">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Teléfono</p>
                      <p className="text-gray-800 dark:text-white">{userData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Ubicación</p>
                      <p className="text-gray-800 dark:text-white">{userData.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(userData.stats).map(([key, value]) => (
                  <div key={key} className="bg-white/50 dark:bg-gray-700/30 p-4 rounded-xl border border-white/30 dark:border-gray-600/30 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <ChartBarIcon className="h-6 w-6 text-indigo-600 dark:text-purple-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-300 capitalize">{key}</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Actions */}
            <div className="space-y-6">
              <div className="bg-white/50 dark:bg-gray-700/30 p-6 rounded-xl shadow-sm border border-white/30 dark:border-gray-600/30">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                  <Cog6ToothIcon className="h-6 w-6 text-indigo-600 dark:text-purple-400 mr-3" />
                  Acciones Rápidas
                </h2>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-gray-600/30 hover:bg-indigo-100 dark:hover:bg-gray-600/50 transition-colors">
                    <span className="text-indigo-600 dark:text-purple-400">Cambiar Contraseña</span>
                    <LockClosedIcon className="h-5 w-5 text-indigo-600 dark:text-purple-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-gray-600/30 hover:bg-indigo-100 dark:hover:bg-gray-600/50 transition-colors">
                    <span className="text-indigo-600 dark:text-purple-400">Editar Perfil</span>
                    <PencilSquareIcon className="h-5 w-5 text-indigo-600 dark:text-purple-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-gray-600/30 hover:bg-indigo-100 dark:hover:bg-gray-600/50 transition-colors">
                    <span className="text-indigo-600 dark:text-purple-400">Preferencias</span>
                    <Cog6ToothIcon className="h-5 w-5 text-indigo-600 dark:text-purple-400" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/50 dark:bg-gray-700/30 p-6 rounded-xl border border-white/30 dark:border-gray-600/30">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Perfil Completo</h3>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-600">
                    <div 
                      style={{ width: '85%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse-striped"
                    />
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-purple-400">
                    85% COMPLETADO
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Edit Button */}
        <button className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:rotate-12">
          <PencilSquareIcon className="h-6 w-6 text-indigo-600 dark:text-purple-400" />
        </button>
      </div>
    </div>
  );
}