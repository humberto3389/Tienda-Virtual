import { useState } from 'react'
import { 
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 1250,
    totalOrders: 342,
    totalRevenue: '$12,345',
    activeProducts: 89
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Panel de Administración
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tarjeta de Usuarios */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
              <UsersIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Usuarios Totales
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Pedidos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <ShoppingBagIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pedidos Totales
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Ingresos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ingresos Totales
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalRevenue}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Productos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Productos Activos
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.activeProducts}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 