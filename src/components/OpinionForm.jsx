import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { opinionService } from '../services/opinionService';
import { productService } from '../services/productService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/auth/AuthContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

const OpinionForm = ({ onSubmitSuccess, fetchOpinions }) => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    mensaje: '',
    rating: 0,
    producto: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      // Efecto de animación al cargar
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  // Cargar productos cuando cambie la búsqueda
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        loadProducts(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else if (searchQuery.length === 0) {
      loadProducts();
    }
  }, [searchQuery]);

  const loadProducts = async (search = '') => {
    try {
      setLoadingProducts(true);
      const result = await productService.getProducts({
        search,
        limit: 20,
        sortBy: 'newest'
      });

      if (result.success) {
        setProducts(result.data);
      } else {
        console.error('Error loading products:', result.error);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Debes iniciar sesión para enviar una opinión');
      return;
    }

    if (!formData.producto) {
      toast.error('Por favor, selecciona un producto de la lista');
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
      
      toast.success('¡Opinión enviada! En espera de aprobación', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)'
        },
        duration: 5000
      });
      
      if (onSubmitSuccess) onSubmitSuccess();
      if (fetchOpinions) fetchOpinions();
      
      setSubmitted(true);
      setFormData({
        mensaje: '',
        rating: 0,
        producto: ''
      });
      setSearchQuery('');
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

  const handleProductSelect = (product) => {
    setFormData(prev => ({
      ...prev,
      producto: product.id
    }));
    setSearchQuery(product.name);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setFormData(prev => ({
        ...prev,
        producto: ''
      }));
    }
  };

  if (!user) {
    return (
      <div className={`bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden max-w-lg mx-auto transform transition-all duration-700 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="relative h-36 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <StarIcon className="w-10 h-10 mx-auto text-white animate-bounce" />
              <h3 className="text-2xl font-bold text-white mt-2">Comparte tu Experiencia</h3>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Acceso Requerido</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Inicia sesión para compartir tus opiniones y ayudar a nuestra comunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-xl font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden max-w-lg mx-auto transform transition-all duration-500">
        <div className="relative h-36 bg-gradient-to-r from-green-400 to-emerald-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-2xl font-bold text-white mt-2">¡Gracias por tu Opinión!</h3>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Tu opinión ha sido enviada y está en espera de aprobación por nuestro equipo. Una vez aprobada, será visible en la sección de opiniones.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              Enviar Otra Opinión
            </button>
            <Link
              to="/productos"
              className="px-6 py-3 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-xl font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden max-w-lg mx-auto transform transition-all duration-500 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
      {/* Encabezado con gradiente */}
      <div className="relative h-36 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white">Comparte tu Experiencia</h3>
            <p className="text-indigo-100 mt-1">
              Tu opinión ayuda a otros clientes a tomar mejores decisiones
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta de usuario flotante */}
      <div className="relative px-6 -mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center space-x-4 border border-gray-100 dark:border-gray-700">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Avatar de usuario" 
              className="h-14 w-14 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Campo de producto */}
        <div className="space-y-2">
          <label htmlFor="producto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ¿Sobre qué producto quieres opinar?
          </label>
          <div className="relative">
            <input
              type="text"
              id="producto"
              name="producto"
              value={searchQuery}
              onChange={handleSearchChange}
              required
              className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-gray-800 shadow-sm"
              placeholder="Busca un producto... (ej: Mouse Gaming)"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              {loadingProducts ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
            
            {/* Lista de productos sugeridos */}
            {searchQuery.length >= 2 && products.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductSelect(product)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image_url || '/placeholder-product.png'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatPrice(product.price)}
                          {product.categories?.name && ` • ${product.categories.name}`}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Mensaje cuando no hay productos */}
            {searchQuery.length >= 2 && products.length === 0 && !loadingProducts && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No se encontraron productos con ese nombre
                </p>
              </div>
            )}
          </div>
          
          {/* Indicador de producto seleccionado */}
          {formData.producto && (
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✅ Producto seleccionado: <span className="font-medium">{searchQuery}</span>
              </p>
            </div>
          )}
        </div>

        {/* Calificación */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Calificación
          </label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className={`transform transition-all duration-200 ${(hoverRating || formData.rating) >= star ? 'scale-110 text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:scale-105'}`}
              >
                <StarIcon className="h-8 w-8" />
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
            className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-gray-800 shadow-sm"
            placeholder="Cuéntanos detalladamente tu experiencia..."
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02] hover:shadow-xl active:scale-95'}`}
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Enviando Opinión...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span>Publicar Opinión</span>
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default OpinionForm;