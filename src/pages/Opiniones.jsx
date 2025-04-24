import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import OpinionForm from '../components/OpinionForm';
import OpinionList from '../components/OpinionList';

const Opiniones = () => {
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener las opiniones
    // Por ahora usamos datos de ejemplo
    const fetchOpinions = async () => {
      try {
        // Simulación de carga de datos
        const sampleOpinions = [
          {
            nombre: "Carlos Rodríguez",
            producto: "Laptop HP Pavilion",
            mensaje: "Excelente producto, muy buena relación calidad-precio. La entrega fue rápida y el servicio al cliente muy atento.",
            rating: 5,
            fecha: "2024-03-15",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"
          },
          {
            nombre: "Laura Martínez",
            producto: "Monitor Dell 27\"",
            mensaje: "El monitor es perfecto para mi trabajo. Los colores son muy precisos y la resolución es excelente.",
            rating: 4,
            fecha: "2024-03-10",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3"
          },
          {
            nombre: "Miguel Sánchez",
            producto: "Teclado Mecánico RGB",
            mensaje: "La calidad del teclado es impresionante. Los switches son suaves y la iluminación RGB es espectacular.",
            rating: 5,
            fecha: "2024-03-05",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3"
          }
        ];
        
        setOpinions(sampleOpinions);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar las opiniones:', error);
        setLoading(false);
      }
    };

    fetchOpinions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 dark:from-indigo-900/20 dark:to-purple-900/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Lo que dicen nuestros clientes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Experiencias reales de usuarios satisfechos con nuestros productos y servicios
            </p>
            
            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">4.8</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Calificación promedio</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Opiniones</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Clientes satisfechos</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">4.5</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Tiempo de respuesta</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de opiniones */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando opiniones...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {opinions.map((opinion, index) => (
                  <div 
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img 
                            src={opinion.avatar} 
                            alt={opinion.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {opinion.nombre}
                          </h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-5 w-5 ${
                                  i < opinion.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">
                          {opinion.producto}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 italic">
                          "{opinion.mensaje}"
                        </p>
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(opinion.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario de opiniones */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <OpinionForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opiniones; 