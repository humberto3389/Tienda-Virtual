import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  TrophyIcon, 
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon, 
  CpuChipIcon, 
  ShieldCheckIcon,
  WifiIcon,
  ComputerDesktopIcon,
  VideoCameraIcon,
  PrinterIcon,
  ServerIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { serviceService } from '../services/serviceService';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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

export default function ServicioDetalle() {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      setLoading(true);
      const result = await serviceService.getServiceById(id);
      if (result.success) {
        setServicio(result.data);
      }
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <LoadingSpinner size="lg" color="gradient" />
      </div>
    );
  }

  if (!servicio) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-6xl mb-6">😞</div>
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Servicio no encontrado</h2>
        <p className="text-gray-500 mb-8">El servicio que intentas ver no existe o ya no está disponible.</p>
        <Link 
          to="/servicios" 
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver a Servicios
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[servicio.icon_name] || WrenchScrewdriverIcon;

  const handleWhatsAppClick = () => {
    const message = `¡Hola! Estoy interesado en el servicio de *${servicio.title}*. ¿Me podrían brindar más información?`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let whatsappUrl = isMobile 
      ? `https://wa.me/51973295101?text=${encodeURIComponent(message)}`
      : `https://web.whatsapp.com/send?phone=51973295101&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0A0A0B] text-white' : 'bg-[#FAFAFA] text-gray-900'}`}>
      
      {/* 1. Hero Banner */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img 
            src={servicio.image_url || 'https://via.placeholder.com/800x400'} 
            alt={servicio.title} 
            className="w-full h-full object-cover"
          />
          {/* Overlay gradiente oscuro */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        </div>

        {/* Contenido Hero */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16">
          <Link 
            to="/servicios"
            className="inline-flex items-center text-white/70 hover:text-white mb-8 transition w-fit backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full text-sm font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver a todos los servicios
          </Link>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-[#3F96FC] rounded-2xl shadow-lg shadow-[#3F96FC]/20">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <span className="text-[#3F96FC] font-bold tracking-widest text-sm uppercase">Soluciones YERSIMAN</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 max-w-3xl leading-tight">
            {servicio.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
            {servicio.description}
          </p>
        </div>
      </div>

      {/* 2. Cuerpo de Detalle y Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          
          {/* Columna Izquierda: Información Detallada */}
          <div className="flex-1 space-y-16">
            
            {/* Qué incluye */}
            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-center">
                <CheckCircleIcon className="h-7 w-7 text-[#3F96FC] mr-3" />
                Lo que incluye el servicio
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicio.features && servicio.features.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-3 p-5 rounded-2xl border ${darkMode ? 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/80' : 'bg-white border-gray-200 hover:shadow-md'} transition-all`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#3F96FC]"></div>
                    </div>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Beneficios */}
            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-center">
                <TrophyIcon className="h-7 w-7 text-[#3F96FC] mr-3" />
                Beneficios Directos
              </h2>
              <div className="space-y-4">
                {servicio.benefits && servicio.benefits.map((beneficio, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-4 p-4 rounded-xl border-l-4 border-[#3F96FC] ${darkMode ? 'bg-gray-800/30' : 'bg-blue-50/50'}`}
                  >
                    <CheckCircleIcon className="h-6 w-6 text-[#3F96FC]" />
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {beneficio}
                    </span>
                  </div>
                ))}
              </div>
            </section>
            
          </div>

          {/* Columna Derecha: Tarjeta Estática (Sticky CTA) */}
          <div className="w-full lg:w-[400px] sticky top-32">
            <div className={`p-8 rounded-[2rem] border shadow-2xl ${darkMode ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-xl' : 'bg-white border-gray-100'}`}>
              
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Precio de Evaluación</p>
                <div className="flex items-end">
                  <h3 className="text-4xl font-black text-[#3F96FC]">
                    {servicio.precio}
                  </h3>
                </div>
                <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  El precio final dependerá del diagnóstico exacto del equipo o magnitud del proyecto.
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleWhatsAppClick}
                  className="w-full py-4 px-6 rounded-2xl bg-[#3F96FC] hover:bg-[#2e7dda] text-white font-bold text-lg shadow-lg shadow-[#3F96FC]/30 flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
                  Solicitar por WhatsApp
                </button>
                
                <div className={`w-full p-4 rounded-2xl flex items-center justify-center border ${darkMode ? 'border-gray-700 bg-gray-900/50 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-700'}`}>
                  <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-500" />
                  <span className="text-sm font-medium">100% Garantía de Servicio</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}