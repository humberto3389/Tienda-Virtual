import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const OpinionForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
    rating: 0,
    producto: ''
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos al backend
    console.log('Datos del formulario:', formData);
    setSubmitted(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-lg mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <h3 className="text-xl font-bold text-white">
          Comparte tu experiencia
        </h3>
        <p className="text-indigo-100 text-sm mt-1">
          Tu opinión ayuda a otros clientes a tomar mejores decisiones
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nombre */}
          <div className="space-y-2">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500"
              placeholder="Tu nombre completo"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email (opcional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500"
              placeholder="tu@email.com"
            />
          </div>

          {/* Producto */}
          <div className="space-y-2">
            <label htmlFor="producto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ¿Sobre qué producto quieres opinar?
            </label>
            <input
              type="text"
              id="producto"
              name="producto"
              value={formData.producto}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500"
              placeholder="Nombre del producto"
            />
          </div>

          {/* Calificación */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Calificación
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className="focus:outline-none transform hover:scale-110 transition-transform"
                >
                  {(hoverRating || formData.rating) >= star ? (
                    <StarIcon className="h-7 w-7 text-yellow-400" />
                  ) : (
                    <StarOutlineIcon className="h-7 w-7 text-gray-300 dark:text-gray-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tu opinión
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              value={formData.mensaje}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500"
              placeholder="Cuéntanos tu experiencia con el producto..."
            />
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg text-base font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            Enviar opinión
          </button>
        </form>
      ) : (
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Gracias por tu opinión!
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
            Tu comentario ha sido enviado y será revisado pronto.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-base"
          >
            Enviar otra opinión
          </button>
        </div>
      )}
    </div>
  );
};

export default OpinionForm; 