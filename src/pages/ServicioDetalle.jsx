import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ServerIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Mapeo de iconos para renderizar
const iconMap = {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ServerIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon
};

export default function ServicioDetalle() {
  const { id } = useParams();
  const [servicio, setServicio] = useState(null);
  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const data = await serviciosService.getServicioById(id);
        if (data) {
          setServicio(data);
          setDetalles(data.detalles);
        } else {
          toast.error("Servicio no encontrado");
        }
      } catch (error) {
        console.error("Error al cargar el servicio:", error);
        toast.error("Error al cargar el servicio");
      } finally {
        setLoading(false);
      }
    };

    fetchServicio();
  }, [id]);

  // Renderizar el icono del servicio
  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || ComputerDesktopIcon;
    return <IconComponent className="h-6 w-6" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!servicio) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Servicio no encontrado
          </h2>
          <Link
            to="/servicios"
            className="text-primary hover:text-primary-dark"
          >
            Volver a servicios
          </Link>
        </div>
      </div>
    );
  }

  const getIcon = (iconName) => {
    const icons = {
      computer: ComputerDesktopIcon,
      mobile: DevicePhoneMobileIcon,
      web: GlobeAltIcon,
      server: ServerIcon,
      security: ShieldCheckIcon,
      maintenance: WrenchScrewdriverIcon,
    };
    return icons[iconName] || ComputerDesktopIcon;
  };

  const Icon = getIcon(servicio.icon);

  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Botón de regreso */}
        <Link 
          to="/servicios"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver a Servicios
        </Link>

        {/* Encabezado del servicio */}
        <div className={`bg-gradient-to-r ${servicio.gradient} rounded-2xl p-8 mb-12`}>
          <div className="flex items-start justify-between">
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <Icon className="h-6 w-6" />
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
              <span className="text-white font-medium">{servicio.price}</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mt-6 mb-4">
            {servicio.name}
          </h1>
          <p className="text-white text-opacity-90 text-lg max-w-3xl">
            {servicio.description}
          </p>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Columna izquierda - Características y detalles */}
          <div className="lg:col-span-2 space-y-12">
            {/* Características */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Características del Servicio
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicio.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-neutral-700">{feature.title}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Detalles */}
            {detalles && (
              <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Detalles del Servicio
                </h2>
                <div className="prose prose-blue max-w-none">
                  {detalles.details.map((detail, index) => (
                    <p key={index} className="text-neutral-700 mb-4">
                      {detail}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Proceso */}
            {detalles && detalles.process && (
              <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Nuestro Proceso
                </h2>
                <div className="space-y-6">
                  {detalles.process.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-neutral-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Columna derecha - Información adicional */}
          <div className="space-y-8">
            {/* Duración */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Duración Estimada
              </h3>
              <p className="text-neutral-600">{servicio.duration}</p>
            </div>

            {/* Requisitos */}
            {detalles && detalles.requirements && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Requisitos
                </h3>
                <ul className="space-y-3">
                  {detalles.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-neutral-600">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Beneficios */}
            {detalles && detalles.benefits && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Beneficios
                </h3>
                <ul className="space-y-3">
                  {detalles.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-neutral-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-4">
                ¿Listo para comenzar?
              </h3>
              <p className="mb-6 text-blue-50">
                Contáctanos ahora para programar tu servicio y recibe una consulta gratuita.
              </p>
              <Link
                to="/contacto"
                className="block w-full text-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Contactar Ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}