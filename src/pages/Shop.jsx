import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductRatingModal from '../components/ProductRatingModal';
import { formatPrice, discountedPrice } from '../utils/formatPrice';
import { 
  ComputerDesktopIcon, 
  CpuChipIcon,
  PrinterIcon,
  CameraIcon,
  ServerIcon,
  Battery100Icon,
  CommandLineIcon,
  BriefcaseIcon,
  SwatchIcon,
  CircleStackIcon,
  DeviceTabletIcon,
  VideoCameraIcon,
  Squares2X2Icon,
  WalletIcon,
  WrenchScrewdriverIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, TagIcon } from '@heroicons/react/24/solid';
import SpecTag from '../components/ui/SpecTag';

// Productos de prueba actualizados con nuevas categorías
const sampleProducts = [
  {
    id: 1,
    name: "Memoria RAM DDR4 16GB",
    price: 89.99,
    discount: 10,
    rating: 4.8,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d3",
    category: "Memoria RAM",
    stock: 25,
    destacado: true
  },
  {
    id: 2,
    name: "SSD Samsung 1TB NVMe",
    price: 129.99,
    discount: 15,
    rating: 4.7,
    reviews: 32,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b",
    category: "Unidades SSD",
    stock: 30,
    destacado: false
  },
  {
    id: 3,
    name: "Laptop HP EliteBook",
    price: 1299.99,
    discount: 0,
    rating: 4.9,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
    category: "Laptops Portátiles",
    stock: 15,
    destacado: false
  },
  {
    id: 4,
    name: "Procesador Intel Core i9",
    price: 599.99,
    discount: 0,
    rating: 4.8,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d3",
    category: "Procesador",
    stock: 10,
    destacado: true
  },
  {
    id: 5,
    name: "Impresora Laser Multifunción",
    price: 299.99,
    discount: 20,
    rating: 4.6,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
    category: "Impresoras",
    stock: 18,
    destacado: false
  },
  {
    id: 6,
    name: "Monitor Gaming 27\"",
    price: 449.99,
    discount: 25,
    rating: 4.5,
    reviews: 35,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
    category: "Monitores",
    stock: 8,
    destacado: true
  },
  {
    id: 7,
    name: "Teclado Mecánico RGB",
    price: 119.99,
    discount: 30,
    rating: 4.7,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    category: "Teclados",
    stock: 12,
    destacado: false
  },
  {
    id: 8,
    name: "Mouse Gaming Inalámbrico",
    price: 79.99,
    discount: 35,
    rating: 4.3,
    reviews: 23,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    category: "Mouse",
    stock: 15,
    destacado: true
  }
];

// Categorías actualizadas jerarquizadas
const sampleCategories = [
  {
    id: "componentes",
    name: "Componentes",
    icon: CpuChipIcon,
    subcategories: [
      "Memoria RAM",
      "Procesador",
      "Tarjeta de Video",
      "Placa Base",
      "Unidades SSD",
      "Discos Externos",
      "Memorias USB"
    ]
  },
  {
    id: "computadoras",
    name: "Computadoras",
    icon: ComputerDesktopIcon,
    subcategories: [
      "Laptops Portátiles",
      "Computadoras Desktop",
      "Tablets",
      "Workstations"
    ]
  },
  {
    id: "perifericos",
    name: "Periféricos",
    icon: PrinterIcon,
    subcategories: [
      "Teclados",
      "Mouse",
      "Trackball y Punteros",
      "Monitores",
      "Impresoras",
      "Tintas"
    ]
  },
  {
    id: "almacenamiento",
    name: "Almacenamiento",
    icon: CircleStackIcon,
    subcategories: [
      "Discos Externos",
      "Memorias USB",
      "Unidades SSD"
    ]
  },
  {
    id: "seguridad",
    name: "Seguridad",
    icon: CameraIcon,
    subcategories: [
      "Cámara de Seguridad",
      "Sistemas de Vigilancia"
    ]
  },
  {
    id: "accesorios",
    name: "Accesorios",
    icon: BriefcaseIcon,
    subcategories: [
      "Cases",
      "Mochilas",
      "UPS y Estabilizadores",
      "Lentes VR"
    ]
  },
  {
    id: "redes",
    name: "Redes",
    icon: ServerIcon,
    subcategories: [
      "Router WiFi",
      "Gabinetes de Servidores"
    ]
  },
  {
    id: "servicios",
    name: "Servicios Técnicos",
    icon: WrenchScrewdriverIcon,
    subcategories: [
      "Mantenimiento PC/Laptops",
      "Reparación Impresoras",
      "Instalación Cámaras"
    ]
  }
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  const [categories, setCategories] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsRatingStats, setProductsRatingStats] = useState({});

  // Función para renderizar estrellas
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

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

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategory, sortBy, searchQuery, priceRange]);

  const loadCategories = async () => {
    try {
      const result = await productService.getCategories();
      if (result.success) {
        // Transformar las categorías para mantener compatibilidad con el diseño existente
        const transformedCategories = result.data.map(category => ({
          id: category.id,
          name: category.name,
          icon: getIconComponent(category.icon_name),
          subcategories: [] // Se cargarán dinámicamente si es necesario
        }));
        setCategories(transformedCategories);
      } else {
        console.warn('No se pudieron cargar las categorías desde la base de datos, usando categorías de muestra');
        // Fallback a categorías estáticas
        setCategories(sampleCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      console.warn('Usando categorías de muestra debido al error');
      // Fallback a categorías estáticas
      setCategories(sampleCategories);
    }
  };

  // Función helper para obtener el componente de icono
  const getIconComponent = (iconName) => {
    const iconMap = {
      'CpuChipIcon': CpuChipIcon,
      'ComputerDesktopIcon': ComputerDesktopIcon,
      'PrinterIcon': PrinterIcon,
      'CameraIcon': CameraIcon,
      'CircleStackIcon': CircleStackIcon,
      'BriefcaseIcon': BriefcaseIcon,
      'ServerIcon': ServerIcon,
      'WrenchScrewdriverIcon': WrenchScrewdriverIcon
    };
    return iconMap[iconName] || Squares2X2Icon;
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener categorías primero para mapear nombres a IDs
      const categoriesResult = await productService.getCategories();
      let categoryId = null;
      
      if (selectedCategory && categoriesResult.success) {
        const category = categoriesResult.data.find(cat => cat.name === selectedCategory);
        if (category) {
          categoryId = category.id;
        }
      }

      const result = await productService.getProducts({
        page: currentPage,
        limit: 9,
        search: searchQuery,
        category: categoryId,
        minPrice: priceRange.min ? parseFloat(priceRange.min) : null,
        maxPrice: priceRange.max ? parseFloat(priceRange.max) : null,
        sortBy: sortBy
      });

      if (result.success) {
        // Transformar los datos para mantener compatibilidad con el diseño existente
        const transformedProducts = result.data.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount,
          rating: product.rating || 0, // Usar rating de la base de datos o 0 por defecto
          reviews: product.reviews_count || 0, // Usar reviews_count de la base de datos o 0 por defecto
          image: product.image_url,
          category: product.categories?.name || 'Sin categoría',
          stock: product.stock,
          destacado: product.is_featured,
          description: product.description,
          specifications: product.specifications || {}
        }));

        setProducts(transformedProducts);
        setTotalProducts(result.total);
        setTotalPages(result.totalPages);

        // Cargar estadísticas de rating para los productos
        await loadProductsRatingStats(transformedProducts.map(p => p.id));
      } else {
        console.warn('No se pudieron cargar los productos desde la base de datos, usando productos de muestra');
        setError('Error al cargar los productos desde la base de datos');
        // Fallback a productos de muestra si hay error
        setProducts(sampleProducts.slice(0, 9));
        setTotalProducts(sampleProducts.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      console.warn('Usando productos de muestra debido al error');
      setError('Error al cargar los productos');
      // Fallback a productos de muestra
      setProducts(sampleProducts.slice(0, 9));
      setTotalProducts(sampleProducts.length);
      setTotalPages(1);
      setError('Error al cargar productos');
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  const loadProductsRatingStats = async (productIds) => {
    try {
      const result = await productService.getMultipleProductsRatingStats(productIds);
      
      if (result.success) {
        setProductsRatingStats(result.data);
      }
    } catch (error) {
      console.error('Error loading products rating stats:', error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSearchParams({ 
      ...Object.fromEntries(searchParams), 
      category,
      page: 1 
    });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({ page: 1 });
  };

  const handleRateProduct = (product) => {
    setSelectedProduct(product);
    setShowRatingModal(true);
  };

  // Componente de Categorías
  const CategorySection = ({ category }) => {
    const [subcategories, setSubcategories] = useState([]);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);

    useEffect(() => {
      if (category.id) {
        loadSubcategories();
      }
    }, [category.id]);

    const loadSubcategories = async () => {
      try {
        setLoadingSubcategories(true);
        const result = await productService.getSubcategories(category.id);
        if (result.success) {
          setSubcategories(result.data);
        } else {
          console.warn('No se pudieron cargar las subcategorías desde la base de datos');
          setSubcategories([]);
        }
      } catch (error) {
        console.error('Error loading subcategories:', error);
        setSubcategories([]);
      } finally {
        setLoadingSubcategories(false);
      }
    };

    return (
      <div className="mb-4 border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
        <div className="flex items-center gap-3 mb-2 text-[#3F96FC]">
          <category.icon className="h-4 w-4" />
          <h3 className="text-[10px] font-light tracking-[0.2em] uppercase opacity-70">{category.name}</h3>
        </div>
        <div className="space-y-1 pl-7">
          {loadingSubcategories ? (
            <div className="text-xs text-gray-400 dark:text-gray-500 font-light">Cargando...</div>
          ) : (
            subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleCategoryChange(sub.name)}
                className={`block w-full text-left px-3 py-1.5 rounded-full text-xs transition-colors ${
                  selectedCategory === sub.name
                    ? 'bg-gray-100 text-[#3F96FC] dark:bg-gray-800 dark:text-[#3F96FC]'
                    : 'text-gray-500 dark:text-gray-400 font-light hover:text-[#3F96FC]'
                }`}
              >
                {sub.name}
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
              ))}
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 text-sm font-light text-gray-900 dark:text-white rounded-full focus:border-[#3F96FC] transition-colors outline-none"
                />
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-5 py-2 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-xs font-light text-gray-600 dark:text-gray-400"
              >
                <FunnelIcon className="h-4 w-4" />
                Filtros
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 px-5 py-2 rounded-full text-xs font-light text-gray-600 dark:text-gray-400 focus:border-[#3F96FC] outline-none"
              >
                <option value="newest">Más recientes</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Categorías */}
          <aside className={`lg:block w-full lg:w-64 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Categorías</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                >
                  Limpiar
                </button>
              </div>
              <div className="space-y-6">
                {categories.map((category) => (
                  <CategorySection key={category.id} category={category} />
                ))}
              </div>
            </div>
          </aside>

          {/* Listado de Productos */}
          <main className="flex-1">
            {error && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      {error}. Mostrando productos de muestra.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {products.map((product) => (
                <div key={product.id} className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Badge de descuento */}
                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-[#FF854D] text-white text-[10px] px-3 py-1.5 rounded-full font-light tracking-wider z-10">
                      -{product.discount}%
                    </div>
                  )}
                  
                  {/* Badge de destacado */}
                  {product.destacado && (
                    <div className="absolute top-4 left-4 bg-[#37383F] text-white text-[10px] px-3 py-1.5 rounded-full font-light tracking-wider z-10">
                      DESTACADO
                    </div>
                  )}
                  
                  <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="mt-4 px-4 pb-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#3F96FC] transition-colors line-clamp-2">
                      <Link to={`/product/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <div className="mt-1 flex items-center">
                      <div className="flex items-center">
                        {renderStars(productsRatingStats[product.id]?.averageRating || product.rating || 0)}
                      </div>
                      <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({productsRatingStats[product.id]?.totalReviews || product.reviews || 0} reseñas)
                      </p>
                    </div>

                    {/* Especificaciones Dinámicas (Tech Store) */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {Object.entries(product.specifications).slice(0, 6).map(([key, value]) => (
                          <SpecTag key={key} label={key} value={value} />
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        {product.discount > 0 && (
                          <p className="text-[10px] text-gray-400 line-through mb-0.5">{formatPrice(product.price)}</p>
                        )}
                        <p className="text-lg font-light text-gray-900 dark:text-white">
                          {formatPrice(discountedPrice(product.price, product.discount))}
                        </p>
                      </div>
                      <div className="p-2 rounded-full transition-colors bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-[#3F96FC] group-hover:text-white dark:group-hover:bg-[#3F96FC] dark:group-hover:text-white">
                        <TagIcon className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-col gap-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="w-full flex justify-center items-center px-4 py-2 rounded-full text-xs font-light tracking-widest text-white bg-[#37383F] hover:bg-[#2a2b30] transition-all"
                      >
                        DETALLES
                      </Link>
                      <button
                        onClick={() => handleRateProduct(product)}
                        className="w-full flex justify-center items-center px-4 py-2 rounded-full text-xs font-light tracking-widest border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                      >
                        CALIFICAR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        setSearchParams({ ...Object.fromEntries(searchParams), page: i + 1 });
                      }}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal de calificación */}
      <ProductRatingModal
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSubmitSuccess={() => {
          // Recargar productos para actualizar ratings
          loadProducts();
        }}
      />
    </div>
  );
}