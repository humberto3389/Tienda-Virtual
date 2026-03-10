import { ComputerDesktopIcon, ShieldCheckIcon, LightBulbIcon, TruckIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { aboutService } from '../services/aboutService';

const About = () => {
  const { darkMode } = useTheme();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const data = await aboutService.getAboutContent();
        if (data) {
          setContent(data.content);
        }
      } catch (error) {
        console.error('Error loading about content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();

    // Suscripción a cambios en tiempo real
    const subscription = aboutService.subscribeToChanges((payload) => {
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        setContent(payload.new.content);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return (
    <div className={`flex items-center justify-center min-h-[60vh] ${darkMode ? 'bg-[#121212]' : 'bg-white'}`}>
      <LoadingSpinner size="lg" />
    </div>
  );

  // Si hay contenido en la base de datos, lo mostramos
  if (content) {
    return (
      <div 
        className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-white'}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Si no hay contenido en la base de datos, mostramos el contenido estático
  const values = [
    {
      icon: ComputerDesktopIcon,
      title: 'Tecnología de Vanguardia',
      description: 'Ofrecemos los equipos más modernos y potentes del mercado'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Calidad Garantizada',
      description: 'Todos nuestros productos cuentan con garantía y soporte técnico'
    },
    {
      icon: LightBulbIcon,
      title: 'Asesoría Personalizada',
      description: 'Te ayudamos a encontrar el equipo perfecto para tus necesidades'
    },
    {
      icon: TruckIcon,
      title: 'Entrega Rápida',
      description: 'Envíos seguros y rápidos a todo el país'
    }
  ];

  // Equipo reducido (empresa nueva)
  const team = [
    {
      name: 'Miguel Torres',
      role: 'Fundador & CEO',
      bio: 'Apasionado por la tecnología y con visión de revolucionar el mercado',
    },
    {
      name: 'Laura Gómez',
      role: 'Especialista en Ventas',
      bio: 'Experta en asesoría técnica y atención al cliente',
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#121212] text-gray-400' : 'bg-white text-gray-600'} transition-colors duration-300 font-light`}>
      <div className="container mx-auto px-4 py-12">
        {/* Sección Principal */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl tracking-tighter mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="font-light">Sobre</span> <span className="font-semibold">nosotros</span>
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="h-[1px] w-8 bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-1 w-1 rounded-full bg-[#3F96FC]"></div>
            <div className="h-[1px] w-8 bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <p className="text-lg max-w-2xl mx-auto opacity-70 leading-relaxed">
            Tu destino tecnológico: equipos de alta calidad, servicio personalizado y precios competitivos.
          </p>
        </div>

        {/* Nuestra Historia */}
        <div className={`rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-20 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
          <div className="grid md:grid-cols-2">
            <div className="p-10 lg:p-16 flex items-center">
              <div>
                <h2 className={`text-2xl font-light tracking-tight mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nuestra historia</h2>
                <div className="space-y-6 opacity-80 leading-relaxed">
                  <p>
                    Nacimos con una visión clara: hacer que la tecnología de alta calidad sea accesible para todos.
                    Fundada en 2025, TechStore surge como respuesta a un mercado que necesitaba un enfoque más
                    personalizado y cercano.
                  </p>
                  <p>
                    Aunque somos nuevos en el mercado, nuestro equipo cuenta con amplia experiencia en el sector
                    tecnológico y una pasión compartida por ofrecer el mejor servicio y los mejores productos.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#37383F] flex items-center justify-center p-12">
              <div className="text-white text-center">
                <h3 className="text-[10px] tracking-[0.3em] uppercase mb-6 opacity-60">Nuestra Misión</h3>
                <p className="text-xl font-light leading-relaxed">
                  Proporcionar soluciones tecnológicas innovadoras y accesibles, con un servicio excepcional que supere
                  las expectativas de nuestros clientes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className={`rounded-2xl p-8 border border-transparent transition-all hover:border-gray-100 dark:hover:border-gray-800 ${
                  darkMode ? 'bg-[#1E1E1E]' : 'bg-white'
                }`}
              >
                <div className="mb-6">
                  <value.icon className={`h-8 w-8 ${darkMode ? 'text-[#3F96FC]' : 'text-[#3F96FC]'} opacity-80`} />
                </div>
                <h3 className={`text-sm font-medium tracking-wide uppercase mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {value.title}
                </h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Equipo */}
        <div className={`rounded-3xl ${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'} border border-gray-100 dark:border-gray-800 p-12 mb-20`}>
          <h2 className={`text-2xl font-light tracking-tight text-center mb-16 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Nuestro equipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-3xl mx-auto">
            {team.map((person) => (
              <div key={person.name} className="group">
                <div className={`w-20 h-20 rounded-full mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} flex items-center justify-center grayscale group-hover:grayscale-0 transition-all border border-gray-100 dark:border-gray-800`}>
                  <span className={`text-2xl font-light ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    {person.name.charAt(0)}
                  </span>
                </div>
                <h3 className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{person.name}</h3>
                <p className="text-xs text-[#3F96FC] font-medium tracking-widest uppercase mt-1 mb-4">{person.role}</p>
                <p className="text-sm opacity-60 italic leading-relaxed">"{person.bio}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Por qué elegirnos */}
        <div className={`rounded-3xl border border-gray-100 dark:border-gray-800 mb-20 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'}`}>
          <div className="p-10 lg:p-16">
            <h2 className={`text-2xl font-light tracking-tight text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ¿Por qué elegirnos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <h3 className={`text-sm font-medium tracking-wide uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Atención Personalizada
                </h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  No somos solo vendedores, somos asesores tecnológicos. Analizamos tus necesidades para recomendarte el equipo ideal para ti.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className={`text-sm font-medium tracking-wide uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Productos Seleccionados
                </h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  Cada producto en nuestro catálogo ha sido cuidadosamente seleccionado por su calidad, rendimiento y durabilidad.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className={`text-sm font-medium tracking-wide uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Servicio Post-Venta
                </h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  Nuestro compromiso no termina con la venta. Te ofrecemos soporte técnico y servicio post-venta para resolver cualquier inquietud.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className={`text-sm font-medium tracking-wide uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Precio Justo
                </h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  Ofrecemos la mejor relación calidad-precio del mercado, sin comprometer el rendimiento ni la durabilidad.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={`rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden ${darkMode ? 'bg-[#1E1E1E]' : 'bg-[#37383F]'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3F96FC]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF854D]/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>
          
          <h2 className="text-3xl font-light tracking-tighter text-white mb-6">
            ¿Buscando la computadora perfecta?
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Nuestro equipo está listo para asesorarte y encontrar el equipo ideal para tus necesidades y presupuesto.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link
              to="/shop"
              className="px-10 py-3 rounded-full bg-[#3F96FC] text-white text-xs tracking-[0.2em] font-medium hover:bg-[#2679e9] transition-all"
            >
              VER CATÁLOGO
            </Link>
            <Link
              to="/contact"
              className="px-10 py-3 rounded-full bg-white/5 text-white border border-white/10 text-xs tracking-[0.2em] font-medium hover:bg-white/10 transition-all"
            >
              CONTACTAR
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;