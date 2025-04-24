import { Link } from 'react-router-dom'
import { useState } from 'react'
import { 
  ComputerDesktopIcon, 
  WifiIcon,
  VideoCameraIcon,
  PrinterIcon,
  CpuChipIcon,
  ServerIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  SparklesIcon,
  PuzzlePieceIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const servicios = [
  {
    id: 1,
    title: 'Mantenimiento Integral',
    subtitle: 'Computadoras & Laptops',
    description: 'Servicio completo de mantenimiento preventivo y correctivo para maximizar la vida útil de tus equipos.',
    icon: ComputerDesktopIcon,
    features: [
      'Limpieza profunda interna/externa',
      'Diagnóstico hardware completo',
      'Optimización de rendimiento',
      'Actualización de componentes',
      'Solución de problemas de software'
    ],
    price: 'Desde S/. 50',
    duration: '2-4 horas',
    category: 'hardware',
    highlight: true
  },
  {
    id: 2,
    title: 'Asistencia Remota',
    subtitle: 'Soporte Técnico Online',
    description: 'Solución inmediata a tus problemas técnicos sin necesidad de desplazamiento físico.',
    icon: WifiIcon,
    features: [
      'Soporte en tiempo real',
      'Configuración de software',
      'Resolución de problemas',
      'Optimización de sistemas',
      'Asesoría personalizada'
    ],
    price: 'Desde $30/hora',
    duration: '1-2 horas',
    category: 'software'
  },
  {
    id: 3,
    title: 'Sistemas de Seguridad',
    subtitle: 'Cámaras & Alarmas',
    description: 'Instalación profesional de sistemas de videovigilancia con monitoreo 24/7.',
    icon: VideoCameraIcon,
    features: [
      'Cámaras HD/4K',
      'Configuración DVR/NVR',
      'Monitoreo remoto',
      'Almacenamiento en la nube',
      'Mantenimiento incluido'
    ],
    price: 'Desde $150',
    duration: '4-6 horas',
    category: 'seguridad',
    highlight: true
  },
  {
    id: 4,
    title: 'Impresoras',
    subtitle: 'Mantenimiento & Reparación',
    description: 'Servicio especializado para impresoras de todas las marcas y modelos.',
    icon: PrinterIcon,
    features: [
      'Limpieza de cabezales',
      'Calibración de color',
      'Reparación mecánica',
      'Configuración de red',
      'Mantenimiento preventivo'
    ],
    price: 'Desde $40',
    duration: '1-3 horas',
    category: 'perifericos'
  },
  {
    id: 5,
    title: 'Optimización Avanzada',
    subtitle: 'Acelera tu Equipo',
    description: 'Mejora radical del rendimiento mediante técnicas profesionales de optimización.',
    icon: CpuChipIcon,
    features: [
      'Análisis de rendimiento',
      'Actualización de drivers',
      'Optimización de memoria',
      'Limpieza profunda',
      'Configuración avanzada'
    ],
    price: 'Desde $60',
    duration: '2-3 horas',
    category: 'optimizacion'
  },
  {
    id: 6,
    title: 'Redes & Conectividad',
    subtitle: 'Cableado Estructurado',
    description: 'Instalación profesional de redes cableadas e inalámbricas para hogares y empresas.',
    icon: ServerIcon,
    features: [
      'Diseño de red',
      'Cableado estructurado',
      'Configuración routers',
      'Optimización WiFi',
      'Seguridad de red'
    ],
    price: 'Desde $120',
    duration: '3-5 horas',
    category: 'redes',
    highlight: true
  }
]

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Todos', icon: PuzzlePieceIcon },
    { id: 'hardware', name: 'Hardware', icon: ComputerDesktopIcon },
    { id: 'software', name: 'Software', icon: ArrowPathIcon },
    { id: 'seguridad', name: 'Seguridad', icon: ShieldCheckIcon },
    { id: 'perifericos', name: 'Periféricos', icon: PrinterIcon },
    { id: 'optimizacion', name: 'Optimización', icon: SparklesIcon },
    { id: 'redes', name: 'Redes', icon: ServerIcon }
  ]

  const filteredServices = selectedCategory === 'all' 
    ? servicios 
    : servicios.filter(service => service.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="relative z-10">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Servicios Técnicos
              </span>
              <span className="block mt-2 text-xl font-medium text-indigo-600 dark:text-indigo-400">
                Soluciones que impulsan tu tecnología
              </span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-lg text-gray-600 dark:text-gray-300">
              Expertos en dar vida a tus dispositivos con soluciones rápidas, eficientes y garantizadas.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transform -translate-y-1'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
                }`}
              >
                <Icon className={`h-5 w-5 mr-2 ${selectedCategory === category.id ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const Icon = service.icon
            return (
              <div 
                key={service.id}
                className={`relative group overflow-hidden rounded-2xl transition-all duration-500 ${
                  service.highlight 
                    ? 'md:transform md:hover:-translate-y-2 shadow-xl' 
                    : 'shadow-lg hover:shadow-xl'
                } ${
                  service.highlight 
                    ? 'border-2 border-indigo-500 dark:border-indigo-400' 
                    : 'border border-gray-200 dark:border-gray-700'
                }`}
              >
                {service.highlight && (
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    POPULAR
                  </div>
                )}
                
                <div className={`h-full flex flex-col ${
                  service.highlight 
                    ? 'bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900' 
                    : 'bg-white dark:bg-gray-800'
                }`}>
                  <div className="p-6 flex-1">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${
                        service.highlight 
                          ? 'bg-indigo-100 dark:bg-indigo-900/50' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Icon className={`h-8 w-8 ${
                          service.highlight 
                            ? 'text-indigo-600 dark:text-indigo-400' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {service.title}
                        </h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                      {service.description}
                    </p>
                    
                    <div className="mt-6 space-y-3">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <CurrencyDollarIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-bold text-gray-900 dark:text-white">
                          {service.price}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {service.duration}
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/servicio/${service.id}`}
                      className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                        service.highlight
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Ver Detalles</span>
                        <ArrowRightIcon className="h-4 w-4" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Services