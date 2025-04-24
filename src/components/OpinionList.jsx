import { StarIcon } from '@heroicons/react/24/solid';

const OpinionList = ({ opinions }) => {
  return (
    <div className="space-y-6">
      {opinions.map((opinion, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          {/* Encabezado de la opinión */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-300">
                  {opinion.nombre.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {opinion.nombre}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {opinion.producto}
                </p>
              </div>
            </div>
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

          {/* Contenido de la opinión */}
          <p className="text-gray-600 dark:text-gray-300 italic">
            "{opinion.mensaje}"
          </p>

          {/* Fecha */}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {new Date(opinion.fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OpinionList; 