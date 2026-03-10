import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import OpinionForm from '../components/OpinionForm';
import {opinionService} from '../services/opinionService';
const Opiniones = () => {
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    promedio: 0,
    total: 0,
    satisfechos: 0,
    tiempoRespuesta: 0
  });

  const fetchOpinions = async () => {
    setLoading(true);
    try {
      const data = await opinionService.getTodasLasOpiniones();
      setOpinions(data);
      
      // Calcular estadísticas dinámicamente
      if (data.length > 0) {
        // Calcular promedio de calificaciones
        const sumaRatings = data.reduce((sum, opinion) => sum + opinion.rating, 0);
        const promedio = (sumaRatings / data.length).toFixed(1);
        
        // Calcular porcentaje de clientes satisfechos (rating >= 4)
        const clientesSatisfechos = data.filter(opinion => opinion.rating >= 4).length;
        const porcentajeSatisfechos = Math.round((clientesSatisfechos / data.length) * 100);
        
        // Tiempo de respuesta promedio (simulado - podría ser un dato real de la base de datos)
        // En este caso usamos un valor fijo, pero podría calcularse si tuviéramos datos de tiempo de respuesta
        const tiempoRespuesta = 4.5;
        
        setStats({
          promedio,
          total: data.length,
          satisfechos: porcentajeSatisfechos,
          tiempoRespuesta
        });
      }
    } catch (error) {
      console.error('Error cargando opiniones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{stats.promedio}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Calificación promedio</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Opiniones</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{stats.satisfechos}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Clientes satisfechos</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{stats.tiempoRespuesta}</div>
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
              <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" color="gradient" />
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
                          {opinion.fecha ? new Date(opinion.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Fecha no disponible'}
                        </div>
                        
                        {/* Mensaje de estado si la opinión está pendiente */}
                        {opinion.status === 'pending' && (
                          <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-md px-3 py-1 inline-block">
                            <span className="font-medium">En revisión:</span> Esta opinión está pendiente de aprobación
                          </div>
                        )}
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
              <OpinionForm fetchOpinions={fetchOpinions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opiniones;