import { Link } from 'react-router-dom';
import { 
  PhoneIcon,
  MapPinIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  TruckIcon,
  EnvelopeIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';
import { contactService } from '../../services/contactService';
import { useState, useEffect } from 'react';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from './Icons';
import { TermsModal, PrivacyModal } from '../../pages/Modals';

export default function Footer() {
  const { darkMode } = useTheme();
  const [contactData, setContactData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [socialLink, setSocialLink] = useState({ url: '', network: '' });
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSocialClick = (e, url, networkName) => {
    e.preventDefault();
    setSocialLink({ url, network: networkName });
    setShowModal(true);
  };

  const handleConfirm = () => {
    window.open(socialLink.url, '_blank', 'noopener,noreferrer');
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const loadContactData = async () => {
      try {
        const { data } = await contactService.getContactInfo();
        const contactMap = data.reduce((acc, item) => {
          acc[item.type] = item.value;
          return acc;
        }, {});
        setContactData(contactMap);
      } catch (error) {
        console.error('Error cargando datos de contacto:', error);
      }
    };
    
    loadContactData();
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={`${darkMode ? 'bg-[#121212] text-gray-400' : 'bg-gray-50 text-gray-600'} transition-colors duration-300 relative border-t border-gray-100 dark:border-gray-800`}>
      {/* Modal de confirmación de redes sociales */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 relative`}>
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Confirmación de redirección
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              ¿Deseas ser redirigido a {socialLink.network}? Serás dirigido a un sitio externo.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className={`px-4 py-2 rounded ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modales de Términos y Políticas */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} darkMode={darkMode} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} darkMode={darkMode} />}

      {/* Sección de beneficios Minimalista */}
      <div className="py-20 bg-white dark:bg-[#18181b] border-b border-gray-100 dark:border-white/5 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 group">
              <div className="text-gray-300 dark:text-gray-700 group-hover:text-black dark:group-hover:text-white transition-colors duration-500">
                <TruckIcon className="h-8 w-8 stroke-1" />
              </div>
              <div>
                <h3 className="font-medium text-black dark:text-white text-xs tracking-[0.2em] uppercase mb-1">Envío Rápido</h3>
                <p className="text-gray-400 text-xs font-light">Entrega en 24-48 hrs</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 group">
              <div className="text-gray-300 dark:text-gray-700 group-hover:text-black dark:group-hover:text-white transition-colors duration-500">
                <CreditCardIcon className="h-8 w-8 stroke-1" />
              </div>
              <div>
                <h3 className="font-medium text-black dark:text-white text-xs tracking-[0.2em] uppercase mb-1">Pago Seguro</h3>
                <p className="text-gray-400 text-xs font-light">Múltiples métodos</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 group">
              <div className="text-gray-300 dark:text-gray-700 group-hover:text-black dark:group-hover:text-white transition-colors duration-500">
                <ShieldCheckIcon className="h-8 w-8 stroke-1" />
              </div>
              <div>
                <h3 className="font-medium text-black dark:text-white text-xs tracking-[0.2em] uppercase mb-1">Garantía Total</h3>
                <p className="text-gray-400 text-xs font-light">Productos certificados</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 group">
              <div className="text-gray-300 dark:text-gray-700 group-hover:text-black dark:group-hover:text-white transition-colors duration-500">
                <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8 stroke-1" />
              </div>
              <div>
                <h3 className="font-medium text-black dark:text-white text-xs tracking-[0.2em] uppercase mb-1">Soporte 24/7</h3>
                <p className="text-gray-400 text-xs font-light">Atención prioritaria</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal Minimalista */}
      <div className="container mx-auto px-6 py-20 bg-white dark:bg-[#18181b] transition-colors duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 max-w-7xl mx-auto">
          {/* Columna 1: Información */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" onClick={scrollToTop} className="inline-block">
              <span className="text-3xl tracking-tighter text-black dark:text-white">
                <span className="font-light">Yer</span>
                <span className="font-semibold">siman</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 font-light leading-relaxed max-w-sm">
              Tu destino definitivo para tecnología de vanguardia y diseño excepcional. Innovación sin concesiones para un estilo de vida superior.
            </p>
            <div className="flex space-x-6">
              <a 
                href="https://www.facebook.com/share/15tZacKsDE/" 
                onClick={(e) => handleSocialClick(e, 'https://www.facebook.com/share/15tZacKsDE/', 'Facebook')}
                className="text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/invites/contact/?igsh=14e0oyxabzw7y&utm_content=1yzhg50" 
                onClick={(e) => handleSocialClick(e, 'https://www.instagram.com/invites/contact/?igsh=14e0oyxabzw7y&utm_content=1yzhg50', 'Instagram')}
                className="text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/@jerzyzegarravillena618?si=Fjq-i6l2k1vYMT7T" 
                onClick={(e) => handleSocialClick(e, 'https://youtube.com/@jerzyzegarravillena618?si=Fjq-i6l2k1vYMT7T', 'YouTube')}
                className="text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
              >
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h3 className="text-[10px] font-medium tracking-[0.2em] text-black dark:text-white uppercase mb-8">
              Explorar
            </h3>
            <ul className="space-y-4">
              {['Tienda', 'Ofertas', 'Blog', 'Sobre Nosotros'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '') === 'tienda' ? 'shop' : item.toLowerCase().replace(' ', '') === 'sobre nosotros' ? 'about' : item.toLowerCase()}`} 
                    onClick={scrollToTop} 
                    className="text-sm font-light text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Cuenta */}
          <div>
            <h3 className="text-[10px] font-medium tracking-[0.2em] text-black dark:text-white uppercase mb-8">
              Cuenta
            </h3>
            <ul className="space-y-4">
              {Object.entries({ 'Mi Perfil': '/profile', 'Mis Pedidos': '/orders', 'Lista de Deseos': '/wishlist' }).map(([name, path]) => (
                <li key={name}>
                  <Link 
                    to={path} 
                    onClick={scrollToTop} 
                    className="text-sm font-light text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-[10px] font-medium tracking-[0.2em] text-black dark:text-white uppercase mb-8">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex flex-col">
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">
                  {contactData.location || 'Quillabamba, Cusco, Peru'}
                </span>
              </li>
              <li className="flex flex-col mt-2">
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">
                  {contactData.phone || '+51 973295101'}
                </span>
              </li>
              <li className="flex flex-col mt-2">
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">
                  {contactData.email || 'jerzyzegarravillena@gmail.com'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Minimalista */}
      <div className="bg-white dark:bg-[#18181b] py-8 border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6">
              <p className="text-xs font-light text-gray-400">
                &copy; {new Date().getFullYear()} Yersiman Solutions.
              </p>
              <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700 hidden md:block"></div>
              <div className="flex gap-4">
                <button onClick={() => setShowPrivacy(true)} className="text-xs font-light text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Privacidad
                </button>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <button onClick={() => setShowTerms(true)} className="text-xs font-light text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Términos
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center space-x-3 group cursor-default">
                <span className={`text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${darkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  Powered by
                </span>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-[#1d1d20] dark:to-[#27272a] border border-gray-100 dark:border-white/10 shadow-sm transition-all duration-500 hover:shadow-indigo-500/10 hover:border-indigo-500/30 group">
                  <img 
                    src="/Logo1.png" 
                    alt="Horizon Studio Logo" 
                    className="h-5 w-auto object-contain rounded-md transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className={`text-base font-bold tracking-tight transition-all duration-500 ${darkMode ? 'text-white' : 'text-black'} group-hover:text-indigo-500`}>
                    Horizon Studio
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}