import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  HomeIcon,
  ArrowPathIcon,
  ShoppingBagIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export default function NotFound() {
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })
  const [clickCount, setClickCount] = useState(0)
  const [showMessage, setShowMessage] = useState(false)

  const moveButton = () => {
    const x = Math.random() * (window.innerWidth - 200)
    const y = Math.random() * (window.innerHeight - 100)
    setButtonPosition({ x, y })
    setClickCount(prev => prev + 1)
  }

  useEffect(() => {
    if (clickCount >= 5) {
      setShowMessage(true)
    }
  }, [clickCount])

  const services = [
    {
      name: 'Inicio',
      icon: HomeIcon,
      href: '/',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Tienda',
      icon: ShoppingBagIcon,
      href: '/shop',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Servicios',
      icon: WrenchScrewdriverIcon,
      href: '/services',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Blog',
      icon: ChatBubbleLeftRightIcon,
      href: '/blog',
      color: 'from-pink-500 to-pink-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Elementos decorativos animados */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-5 dark:opacity-10 animate-pulse-slow"></div>
      
      {/* Círculos flotantes */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/30 dark:to-transparent animate-gradient-x"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-50 dark:bg-sky-900/20 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3 animate-float"></div>
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-2xl animate-float-delayed"></div>
      <div className="absolute top-2/3 right-1/4 w-48 h-48 bg-sky-50 dark:bg-sky-900/20 rounded-full blur-2xl animate-float-more-delayed"></div>
      
      {/* Partículas decorativas */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-blue-400 dark:bg-blue-500 rounded-full opacity-30 animate-bounce-slow"></div>
      <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-sky-400 dark:bg-sky-500 rounded-full opacity-30 animate-bounce-slow-delayed"></div>
      <div className="absolute top-2/3 left-1/2 w-2 h-2 bg-blue-300 dark:bg-blue-400 rounded-full opacity-30 animate-bounce-slow-more-delayed"></div>

      <div className="text-center space-y-8 relative z-10">
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 dark:from-blue-400 dark:via-sky-400 dark:to-blue-300 animate-gradient-text">
          404
        </h1>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
            ¡Oops! Página no encontrada
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto animate-fade-in-delayed">
            Parece que te has perdido en el ciberespacio. 
            {showMessage ? (
              <span className="block mt-2 text-blue-600 dark:text-blue-400 font-medium">
                ¡Buen intento! Pero el botón no te llevará a ninguna parte 😉
              </span>
            ) : (
              <span className="block mt-2">
                Intenta atrapar el botón si puedes...
              </span>
            )}
          </p>
        </div>

        {!showMessage ? (
          <button
            onClick={moveButton}
            style={{
              position: 'absolute',
              left: `${buttonPosition.x}px`,
              top: `${buttonPosition.y}px`,
              transition: 'all 0.3s ease'
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-500 dark:to-sky-400 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse-slow"
          >
            ¡Haz clic aquí!
          </button>
        ) : (
          <div className="space-y-6">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-500 dark:to-sky-400 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-fade-in"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Volver al inicio
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ml-4 animate-fade-in-delayed"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Intentar de nuevo
            </button>
          </div>
        )}

        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 animate-fade-in">
            O navega a alguna de nuestras secciones:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <Link
                key={service.name}
                to={service.href}
                className={`group p-4 rounded-xl bg-gradient-to-br ${service.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <service.icon className="h-6 w-6 mb-2" />
                <span className="block font-medium">{service.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 text-gray-600 dark:text-gray-300 animate-fade-in">
          <p>¿Necesitas ayuda? Contáctanos en</p>
          <a href="mailto:soporte@jerzystore.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            soporte@jerzystore.com
          </a>
        </div>
      </div>
    </div>
  )
} 