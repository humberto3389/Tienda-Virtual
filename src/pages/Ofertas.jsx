import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { 
  ComputerDesktopIcon, 
  CpuChipIcon,
  PrinterIcon,
  CameraIcon,
  ServerIcon,
  BriefcaseIcon,
  CircleStackIcon,
  WrenchScrewdriverIcon,
  FunnelIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, TagIcon } from '@heroicons/react/24/solid';
import { productService } from '../services/productService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { discountedPrice } from '../utils/formatPrice';

// Categorías dinámicas cargadas desde el servicio

const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getProducts({ discounted: true, limit: 100 }),
        productService.getCategories()
      ]);

      let products = [];
      if (productsRes.success) {
        products = productsRes.data;
        
        // Cargar estadísticas de rating para cada producto
        const productIds = products.map(p => p.id);
        if (productIds.length > 0) {
          const ratingStatsResult = await productService.getMultipleProductsRatingStats(productIds);

          if (ratingStatsResult.success) {
            // Combinar productos con sus estadísticas de rating
            products = products.map(product => ({
              ...product,
              rating: ratingStatsResult.data[product.id]?.averageRating || product.rating || 0,
              reviews_count: ratingStatsResult.data[product.id]?.totalReviews || product.reviews_count || 0
            }));
          }
        }
        setOfertas(products);
      }
      
      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }
    } catch (error) {
      console.error('Error loading offers data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para renderizar estrellas (igual que antes)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
        stars.push(
          <StarSolidIcon 
            key={i} 
            className={`h-4 w-4 ${i < fullStars ? 'text-[#FF854D]' : 'text-gray-200 dark:text-gray-700'}`} 
          />
        );
    }
    return stars;
  };

  // Filtrar ofertas por categoría seleccionada y búsqueda
  const filteredOfertas = ofertas.filter(oferta => {
    const matchesCategory = !selectedCategory || oferta.category_id === selectedCategory;
    const matchesSearch = !searchQuery || 
      oferta.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Componente de Categorías para el sidebar
  const CategoryItem = ({ category }) => (
    <div className="mb-2">
      <button
        onClick={() => {
          setSelectedCategory(category.id);
          setShowFilters(false);
        }}
        className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
          selectedCategory === category.id
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <TagIcon className="h-4 w-4 mr-2 opacity-50" />
        {category.name}
      </button>
    </div>
  );

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" color="gradient" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar ofertas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
              >
                <FunnelIcon className="h-5 w-5" />
                {selectedCategory || 'Categorías'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de categoría móvil */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute top-0 right-0 h-full w-3/4 bg-white dark:bg-gray-800 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filtrar por categoría</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-6">
              <button
                onClick={clearFilters}
                className={`block w-full text-left px-4 py-2 rounded-md text-sm ${
                  !selectedCategory 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Todas las categorías
              </button>
                {categories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </div>
            <button
              onClick={clearFilters}
              className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Categorías - Versión desktop */}
          <aside className="hidden lg:block w-64">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Categorías</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Limpiar
                </button>
              </div>
              <div className="space-y-6">
                <button
                  onClick={clearFilters}
                  className={`block w-full text-left px-4 py-2 rounded-md text-sm ${
                    !selectedCategory 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Todas las categorías
                </button>
                {categories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </div>
            </div>
          </aside>

          {/* Listado de Ofertas */}
          <main className="flex-1">
            {/* Mostrar filtro activo */}
            {selectedCategory && (
              <div className="mb-6 flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Filtro:</span>
                <div className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full">
                  <span>{selectedCategory}</span>
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {filteredOfertas.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay ofertas disponibles con los filtros seleccionados</h3>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Ver todas las ofertas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {filteredOfertas.map((oferta) => (
              <div key={oferta.id} className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Badge de descuento */}
                <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg font-bold z-10">
                  -{oferta.discount}%
                </div>
                
                {/* Badge de destacado */}
                {oferta.is_featured && (
                  <div className="absolute top-0 left-0 bg-indigo-500 text-white px-3 py-1 rounded-br-lg font-bold z-10">
                    Destacado
                  </div>
                )}
                
                <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden group-hover:opacity-75">
                  <img
                    src={oferta.image_url || '/placeholder-product.png'}
                    alt={oferta.name}
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="mt-4 px-4 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    <Link to={`/product/${oferta.id}`}>
                      {oferta.name}
                    </Link>
                  </h3>
                  <div className="mt-1 flex items-center">
                    <div className="flex items-center">
                      {renderStars(oferta.rating || 0)}
                    </div>
                    <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">({oferta.reviews_count || 0} reseñas)</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-through">{formatPrice(oferta.price)}</p>
                      <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{formatPrice(discountedPrice(oferta.price, oferta.discount))}</p>
                    </div>
                    <div className="flex items-center">
                      <TagIcon className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-green-500 dark:text-green-400">
                        {oferta.stock > 0 ? 'En stock' : 'Agotado'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/product/${oferta.id}`}
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Ofertas;