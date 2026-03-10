import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  PuzzlePieceIcon as CategoryIcon
} from '@heroicons/react/24/outline'
import { serviceService } from '../services/serviceService'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const iconMap = {
  ComputerDesktopIcon,
  WifiIcon,
  VideoCameraIcon,
  PrinterIcon,
  CpuChipIcon,
  ServerIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  SparklesIcon
};

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const result = await serviceService.getServices()
      if (result.success) {
        setServices(result.data)
      }
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'Todos', icon: CategoryIcon },
    { id: 'hardware', name: 'Hardware', icon: ComputerDesktopIcon },
    { id: 'software', name: 'Software', icon: ArrowPathIcon },
    { id: 'seguridad', name: 'Seguridad', icon: ShieldCheckIcon },
    { id: 'perifericos', name: 'Periféricos', icon: PrinterIcon },
    { id: 'optimizacion', name: 'Optimización', icon: SparklesIcon },
    { id: 'redes', name: 'Redes', icon: ServerIcon }
  ]

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => (service.category || '').toLowerCase() === selectedCategory.toLowerCase())

  const getIcon = (iconName) => {
    const Icon = iconMap[iconName] || WrenchScrewdriverIcon;
    return <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />;
  };

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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" color="gradient" />
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              return (
                <div 
                  key={service.id}
                  className={`relative group overflow-hidden rounded-2xl transition-all duration-500 ${
                    service.is_featured 
                      ? 'md:transform md:hover:-translate-y-2 shadow-xl' 
                      : 'shadow-lg hover:shadow-xl'
                  } ${
                    service.is_featured 
                      ? 'border-2 border-indigo-500 dark:border-indigo-400' 
                      : 'border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {service.is_featured && (
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      POPULAR
                    </div>
                  )}
                  
                  <div className={`h-full flex flex-col ${
                    service.is_featured 
                      ? 'bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900' 
                      : 'bg-white dark:bg-gray-800'
                  }`}>
                    <div className="p-6 flex-1">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${
                          service.is_featured 
                            ? 'bg-indigo-100 dark:bg-indigo-900/50' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          {getIcon(service.icon_name)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {service.title}
                          </h3>
                          <p className={`text-sm font-medium ${
                            service.is_featured ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {service.subtitle}
                          </p>
                        </div>
                      </div>
                      
                      <p className="mt-4 text-gray-600 dark:text-gray-300">
                        {service.description}
                      </p>
                      
                      <div className="mt-6 space-y-3">
                        {service.features && service.features.slice(0, 5).map((feature, index) => (
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
                        {service.duration && (
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {service.duration}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Link
                        to={`/servicios/${service.id}`}
                        className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                          service.is_featured
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
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No se encontraron servicios en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Services