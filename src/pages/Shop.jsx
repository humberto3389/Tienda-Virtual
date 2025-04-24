import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  ComputerDesktopIcon, 
  DevicePhoneMobileIcon, 
  CpuChipIcon, 
  BeakerIcon,
  StarIcon,
  ChevronRightIcon,
  FunnelIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

// Productos de prueba
const sampleProducts = [
  {
    id: 1,
    name: "Laptop Pro X1",
    price: 1299.99,
    discount: 15,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3",
    isNew: true,
    stock: 8,
    category: "laptops",
    description: "Potencia y elegancia en un solo dispositivo. Perfecta para profesionales creativos y desarrolladores."
  },
  {
    id: 2,
    name: "Monitor Ultra HD 32\"",
    price: 499.99,
    discount: 0,
    rating: 4.9,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3",
    isNew: false,
    stock: 15,
    category: "monitores",
    description: "Resolución 4K con tecnología HDR para colores vibrantes y detalles nítidos."
  },
  {
    id: 3,
    name: "Teclado Mecánico RGB",
    price: 129.99,
    discount: 20,
    rating: 4.7,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3",
    isNew: false,
    stock: 3,
    category: "perifericos",
    description: "Switches mecánicos personalizables con retroiluminación RGB y diseño ergonómico."
  },
  {
    id: 4,
    name: "SSD 1TB NVMe",
    price: 199.99,
    discount: 10,
    rating: 4.9,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3",
    isNew: true,
    stock: 12,
    category: "almacenamiento",
    description: "Velocidades de lectura/escritura ultrarrápidas para mejorar el rendimiento de tu sistema."
  },
  {
    id: 5,
    name: "Workstation Pro",
    price: 2499.99,
    discount: 0,
    rating: 5.0,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3",
    isNew: true,
    stock: 5,
    category: "workstations",
    description: "Potencia extrema para renderizado 3D, edición de video y desarrollo de software."
  },
  {
    id: 6,
    name: "Mouse Gaming Inalámbrico",
    price: 79.99,
    discount: 0,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3",
    isNew: false,
    stock: 20,
    category: "perifericos",
    description: "Precisión milimétrica con sensor óptico avanzado y batería de larga duración."
  },
  {
    id: 7,
    name: "Tarjeta Gráfica RTX 4080",
    price: 1199.99,
    discount: 0,
    rating: 4.9,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d3?ixlib=rb-4.0.3",
    isNew: true,
    stock: 7,
    category: "componentes",
    description: "Rendimiento de nivel superior para gaming y creación de contenido."
  },
  {
    id: 8,
    name: "Auriculares con Cancelación de Ruido",
    price: 299.99,
    discount: 15,
    rating: 4.7,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3",
    isNew: false,
    stock: 10,
    category: "perifericos",
    description: "Audio premium con cancelación de ruido activa y comodidad para uso prolongado."
  },
  {
    id: 9,
    name: "Router WiFi 6",
    price: 159.99,
    discount: 0,
    rating: 4.5,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3",
    isNew: true,
    stock: 15,
    category: "redes",
    description: "Conexión de alta velocidad con cobertura amplia para todo tu hogar u oficina."
  }
];

// Categorías de prueba
const sampleCategories = [
  { 
    id: "computadoras", 
    name: "Computadoras", 
    icon: ComputerDesktopIcon,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3",
    count: 15,
    subcategories: ["Desktop", "Laptops", "Tablets"]
  },
  { 
    id: "componentes", 
    name: "Componentes", 
    icon: CpuChipIcon,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d3?ixlib=rb-4.0.3",
    count: 20,
    subcategories: ["Procesadores", "Memoria RAM", "Tarjetas de Video", "Placas Base"]
  },
  { 
    id: "almacenamiento", 
    name: "Almacenamiento", 
    icon: BeakerIcon,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3",
    count: 12,
    subcategories: ["SSD", "Discos Externos", "Memorias USB"]
  },
  { 
    id: "perifericos", 
    name: "Periféricos", 
    icon: DevicePhoneMobileIcon,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3",
    count: 25,
    subcategories: ["Teclados", "Mouse", "Trackball", "Punteros"]
  },
  { 
    id: "monitores", 
    name: "Monitores", 
    icon: ComputerDesktopIcon,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3",
    count: 10,
    subcategories: ["Monitores LED", "Monitores Gaming", "Monitores Profesionales"]
  },
  { 
    id: "impresoras", 
    name: "Impresoras", 
    icon: BeakerIcon,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3",
    count: 8,
    subcategories: ["Impresoras Láser", "Impresoras de Tinta", "Tintas y Toners"]
  },
  { 
    id: "seguridad", 
    name: "Seguridad", 
    icon: BeakerIcon,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3",
    count: 6,
    subcategories: ["Cámaras de Seguridad", "Sistemas de Vigilancia"]
  },
  { 
    id: "accesorios", 
    name: "Accesorios", 
    icon: BeakerIcon,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3",
    count: 15,
    subcategories: ["Cases", "Mochilas", "UPS", "Estabilizadores"]
  },
  { 
    id: "varios", 
    name: "Varios", 
    icon: BeakerIcon,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3",
    count: 10,
    subcategories: ["Lentes VR", "Gabinetes de Servidores", "Accesorios Varios"]
  }
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  })

  // Obtener parámetros de la URL
  const page = parseInt(searchParams.get('page')) || 1
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sort = searchParams.get('sort') || 'newest'

  useEffect(() => {
    // Simular carga de datos
    setLoading(true)
    
    // Cargar categorías
    setCategories(sampleCategories)
    
    // Filtrar productos
    let filteredProducts = [...sampleProducts]
    
    // Filtrar por categoría
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory)
    }
    
    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      )
    }
    
    // Filtrar por precio
    if (priceRange.min) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(priceRange.min))
    }
    if (priceRange.max) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(priceRange.max))
    }
    
    // Ordenar productos
    switch (sortBy) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'name_asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      default: // newest
        filteredProducts.sort((a, b) => b.isNew - a.isNew)
    }
    
    // Paginación
    const itemsPerPage = 9
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)
    
    setProducts(paginatedProducts)
    setTotalProducts(filteredProducts.length)
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage))
    setLoading(false)
  }, [currentPage, selectedCategory, sortBy, searchQuery, priceRange])

  const handleFilterChange = (newParams) => {
    setSearchParams({ ...Object.fromEntries(searchParams), ...newParams, page: 1 })
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    setSearchParams({ ...Object.fromEntries(searchParams), page: newPage })
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
    handleFilterChange({ category: categoryId })
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
    setCurrentPage(1)
    handleFilterChange({ sort })
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
    handleFilterChange({ search: query })
  }

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max })
    setCurrentPage(1)
    handleFilterChange({ minPrice: min, maxPrice: max })
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSearchQuery('')
    setPriceRange({ min: '', max: '' })
    setSortBy('newest')
    setCurrentPage(1)
    setSearchParams({ page: 1 })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 animate-pulse rounded" />
              <div className="h-64 bg-gray-200 animate-pulse rounded" />
              <div className="h-64 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-80" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 p-6 rounded-xl shadow-sm">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Filtros y Búsqueda */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Búsqueda */}
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

            {/* Filtros */}
            <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FunnelIcon className="h-5 w-5" />
                Filtros
              </button>
          
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          {/* Sidebar de Filtros */}
          {showFilters && (
            <div className="lg:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Limpiar
                </button>
              </div>
              
              {/* Categorías */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Categorías</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        selectedCategory === category.id
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Rango de Precios */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Rango de Precios</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange(e.target.value, priceRange.max)}
                    className="w-1/2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(priceRange.min, e.target.value)}
                    className="w-1/2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Lista de Productos */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando productos...</p>
            </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-48">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                          {product.isNew && (
                          <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                              Nuevo
                            </span>
                          )}
                          {product.discount > 0 && (
                          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                              -{product.discount}%
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            ({product.reviews})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.discount > 0 ? (
                              <>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                </span>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                                  ${product.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 