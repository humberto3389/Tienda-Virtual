import { Link } from 'react-router-dom'
import { 
  PhoneIcon,
  MapPinIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  TruckIcon,
  EnvelopeIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '@/context/ThemeContext'

import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon
} from './Icons'

export default function Footer() {
  const { darkMode } = useTheme();
  
  return (
    <footer className={`${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'} transition-colors duration-300`}>
      {/* Sección de beneficios */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-12 transition-colors duration-300`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 p-2 rounded-full flex-shrink-0 mt-1">
                <TruckIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg mb-1 transition-colors duration-300`}>Envío Rápido</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm transition-colors duration-300`}>Entrega en 24-48 horas</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 p-2 rounded-full flex-shrink-0 mt-1">
                <CreditCardIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg mb-1 transition-colors duration-300`}>Pago Seguro</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm transition-colors duration-300`}>Múltiples métodos</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 p-2 rounded-full flex-shrink-0 mt-1">
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg mb-1 transition-colors duration-300`}>Garantía</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm transition-colors duration-300`}>Productos certificados</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 p-2 rounded-full flex-shrink-0 mt-1">
                <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg mb-1 transition-colors duration-300`}>Soporte</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm transition-colors duration-300`}>Atención 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Columna 1: Información */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Yersiman Solutions
              </span>
            </Link>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed transition-colors duration-300`}>
              Tu destino premium para tecnología y lifestyle. Productos de calidad con servicio excepcional.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors`}>
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors`}>
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors`}>
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors`}>
                <LinkedinIcon className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors flex items-center`}>
                  <ChevronRightIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Tienda
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors flex items-center`}>
                  <ChevronRightIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Nuevos Productos
                </Link>
              </li>
              <li>
                <Link to="/deals" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors flex items-center`}>
                  <ChevronRightIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Ofertas
                </Link>
              </li>
              <li>
                <Link to="/blog" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors flex items-center`}>
                  <ChevronRightIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors flex items-center`}>
                  <ChevronRightIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Mi cuenta */}
          <div>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
              Mi Cuenta
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/account" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors flex items-center`}>
                  <ChevronRightIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link to="/orders" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors flex items-center`}>
                  <ChevronRightIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors flex items-center`}>
                  <ChevronRightIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Lista de Deseos
                </Link>
              </li>
              <li>
                <Link to="/cart" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors flex items-center`}>
                  <ChevronRightIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                  Av. Principal 123, Ciudad
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <PhoneIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                  +1 234 567 890
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                  info@yersimansolutions.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={`${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-100 border-t border-gray-200'} py-6 transition-colors duration-300`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm transition-colors duration-300`}>
              &copy; {new Date().getFullYear()} Yersiman Solutions. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} text-sm transition-colors`}>
                Política de Privacidad
              </Link>
              <Link to="/terms" className={`${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} text-sm transition-colors`}>
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}