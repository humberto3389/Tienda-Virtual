import { useState, useEffect } from 'react';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { opinionService } from '../services/opinionService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/auth/AuthContext';

const ProductRatingModal = ({ isOpen, onClose, product, onSubmitSuccess }) => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    mensaje: '',
    rating: 0,
    producto: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-llenar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        mensaje: '',
        rating: 0,
        producto: product.id
      });
    }
  }, [isOpen, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Debes iniciar sesión para enviar una opinión');
      return;
    }

    if (!formData.rating) {
      toast.error('Por favor, selecciona una calificación');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await opinionService.crearOpinion({
        producto: formData.producto,
        mensaje: formData.mensaje,
        rating: formData.rating
      });
      
      toast.success('¡Opinión enviada exitosamente!', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)'
        },
        duration: 4000
      });
      
      // Mostrar mensaje adicional sobre moderación
      setTimeout(() => {
        const isVerifiedUser = user?.user_metadata?.verified || 
                              user?.user_metadata?.role === 'admin' ||
                              user?.email?.includes('@jerzystore.com');
        
        if (isVerifiedUser) {
          toast('¡Tu opinión ha sido publicada inmediatamente!', {
            style: {
              background: '#4caf50',
              color: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)'
            },
            duration: 4000
          });
        } else {
          toast('Tu opinión será revisada por nuestro equipo antes de publicarse', {
            style: {
              background: '#2196f3',
              color: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)'
            },
            duration: 6000
          });
        }
      }, 1000);
      
      if (onSubmitSuccess) onSubmitSuccess();
      
      // Limpiar formulario y cerrar modal
      setFormData({
        mensaje: '',
        rating: 0,
        producto: ''
      });
      onClose();
    } catch (error) {
      console.error('Error al enviar opinión:', error);
      toast.error('Error al enviar opinión', {
        style: {
          background: '#f44336',
          color: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(244, 67, 54, 0.3)'
        }
      });
      setError('No se pudo enviar tu opinión. Por favor, intenta nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Calificar Producto
              </h3>
              {product && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {product.name}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!user ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Acceso Requerido
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Inicia sesión para calificar este producto
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Usuario info */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar" 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Calificando: {product?.name}
                    </p>
                  </div>
                </div>

                {/* Calificación */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tu calificación
                  </label>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className={`transform transition-all duration-200 ${
                          (hoverRating || formData.rating) >= star 
                            ? 'scale-110 text-yellow-400' 
                            : 'text-gray-300 dark:text-gray-600 hover:scale-105'
                        }`}
                      >
                        <StarIcon className="h-8 w-8" />
                      </button>
                    ))}
                  </div>
                  {formData.rating > 0 && (
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {formData.rating === 1 && 'Muy malo'}
                      {formData.rating === 2 && 'Malo'}
                      {formData.rating === 3 && 'Regular'}
                      {formData.rating === 4 && 'Bueno'}
                      {formData.rating === 5 && 'Excelente'}
                    </p>
                  )}
                </div>

                {/* Comentario */}
                <div className="space-y-2">
                  <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tu comentario (opcional)
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={4}
                    value={formData.mensaje}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Cuéntanos tu experiencia con este producto..."
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Información sobre moderación */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                        Proceso de moderación
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                        {user?.user_metadata?.verified || user?.user_metadata?.role === 'admin' || user?.email?.includes('@jerzystore.com') 
                          ? 'Tu opinión será publicada inmediatamente por ser un usuario verificado.'
                          : 'Tu opinión será revisada por nuestro equipo antes de publicarse. Esto nos ayuda a mantener la calidad del contenido.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.rating}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Enviando...' : 'Enviar Calificación'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRatingModal;
