import { useState } from 'react';
import { Link } from 'react-router-dom';

const Servicios = () => {
  const [servicios] = useState([
    {
      id: 1,
      titulo: "Mantenimiento de Equipos",
      descripcion: "Servicio completo de mantenimiento preventivo y correctivo para tus equipos informáticos.",
      imagen: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3",
      precio: "Desde $50.000"
    },
    {
      id: 2,
      titulo: "Reparación de Hardware",
      descripcion: "Diagnóstico y reparación de componentes de hardware para laptops y computadoras de escritorio.",
      imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d3?ixlib=rb-4.0.3",
      precio: "Desde $30.000"
    },
    {
      id: 3,
      titulo: "Instalación de Software",
      descripcion: "Instalación y configuración de sistemas operativos y software especializado.",
      imagen: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3",
      precio: "Desde $25.000"
    },
    {
      id: 4,
      titulo: "Redes y Conectividad",
      descripcion: "Configuración y mantenimiento de redes locales y soluciones de conectividad.",
      imagen: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3",
      precio: "Desde $40.000"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ofrecemos soluciones integrales para todas tus necesidades tecnológicas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={servicio.imagen}
                  alt={servicio.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white">{servicio.titulo}</h3>
                  <p className="text-white/80">{servicio.precio}</p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {servicio.descripcion}
                </p>
                <Link
                  to={`/servicios/${servicio.id}`}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Servicios; 