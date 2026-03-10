import { useState, useEffect } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  TagIcon,
  StarIcon,
  CurrencyDollarIcon,
  CubeIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { productService } from '../../services/productService';
import { storageService } from '../../services/storageService';
import { formatPrice, discountedPrice } from '../../utils/formatPrice';

export default function AdminProducts() {
  // Genera un SKU a partir del nombre del producto y la categoría seleccionada
  const generateSKU = (name, categoryName = '') => {
    const catPrefix = (categoryName || 'GEN').replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
    const namePrefix = (name || '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${catPrefix}-${namePrefix}-${randomNum}`;
  };
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [stats, setStats] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    rating: '',
    reviews_count: '',
    image_url: '',
    product_images: [], // Nueva galería de imágenes
    category_id: '',
    subcategory_id: '',
    stock: '',
    is_featured: false,
    is_active: true,
    sku: '',
    weight: '',
    specifications: [],
    tags: []
  });

  useEffect(() => {
    loadData();
  }, [currentPage, searchQuery, selectedCategory, selectedSubcategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar productos
      const productsResult = await productService.getProducts({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        category: selectedCategory,
        subcategory: selectedSubcategory
      });

      if (productsResult.success) {
        setProducts(productsResult.data);
        setTotalPages(productsResult.totalPages);
        setTotalProducts(productsResult.total);
      }

      // Cargar categorías
      const categoriesResult = await productService.getCategories();
      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }

      // Cargar estadísticas
      const statsResult = await productService.getProductStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }

    } catch (error) {
      setError('Error al cargar los datos');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    const result = await productService.getSubcategories(categoryId);
    if (result.success) {
      setSubcategories(result.data);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({ ...prev, category_id: categoryId, subcategory_id: '' }));
    loadSubcategories(categoryId);
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      setUploadingImage(true);
      setError(null);

      const newImages = [...formData.product_images];

      for (const file of files) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          setError(`El archivo ${file.name} no es una imagen válida`);
          continue;
        }

        // Comprimir brutalmente
        const { imageCompressionService } = await import('../../services/imageCompressionService');
        const compressedFile = await imageCompressionService.compressBrutal(file);

        // Subir a storage
        const imageUrl = await storageService.uploadProductImage(compressedFile, 'none');
        
        newImages.push({
          image_url: imageUrl,
          is_primary: newImages.length === 0
        });
      }

      setFormData(prev => ({ 
        ...prev, 
        product_images: newImages,
        image_url: prev.image_url || (newImages.length > 0 ? newImages[0].image_url : '')
      }));
      
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Error al subir las imágenes. Inténtalo de nuevo.');
    } finally {
      setUploadingImage(false);
      // Limpiar input
      event.target.value = '';
    }
  };

  const addImageUrl = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url && url.trim()) {
      setFormData(prev => {
        const newImages = [...prev.product_images, { image_url: url.trim(), is_primary: prev.product_images.length === 0 }];
        return {
          ...prev,
          product_images: newImages,
          image_url: prev.image_url || url.trim()
        };
      });
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => {
      const newImages = prev.product_images.filter((_, i) => i !== index);
      let newMainUrl = prev.image_url;
      
      // Si borramos la imagen principal, asignar la primera disponible
      if (prev.product_images[index].image_url === prev.image_url) {
        newMainUrl = newImages.length > 0 ? newImages[0].image_url : '';
      }
      
      return {
        ...prev,
        product_images: newImages,
        image_url: newMainUrl
      };
    });
  };

  const setPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      image_url: prev.product_images[index].image_url,
      product_images: prev.product_images.map((img, i) => ({
        ...img,
        is_primary: i === index
      }))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { product_images, ...productData } = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount) || 0,
        rating: parseFloat(formData.rating) || 0,
        reviews_count: parseInt(formData.reviews_count) || 0,
        stock: parseInt(formData.stock) || 0,
        weight: parseFloat(formData.weight) || null,
        specifications: formData.specifications.reduce((acc, curr) => {
          if (curr.key.trim() && curr.value.trim()) {
            acc[curr.key.trim()] = curr.value.trim();
          }
          return acc;
        }, {}),
        tags: Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      let result;
      if (editingProduct) {
        result = await productService.updateProduct(editingProduct.id, productData);
      } else {
        result = await productService.createProduct(productData);
      }

      if (result.success) {
        // Sincronizar galería de imágenes
        await productService.syncProductImages(
          editingProduct ? editingProduct.id : result.data.id, 
          formData.product_images
        );

        setShowModal(false);
        setEditingProduct(null);
        resetForm();
        loadData();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Error al guardar el producto');
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      discount: product.discount || '',
      rating: product.rating || '',
      reviews_count: product.reviews_count || '',
      image_url: product.image_url || '',
      category_id: product.category_id || '',
      subcategory_id: product.subcategory_id || '',
      stock: product.stock || '',
      is_featured: product.is_featured || false,
      is_active: product.is_active !== false,
      sku: product.sku || '',
      weight: product.weight || '',
      specifications: product.specifications 
        ? Object.entries(product.specifications).map(([k, v]) => ({key: k, value: v})) 
        : [],
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || '',
      product_images: product.product_images || []
    });
    
    // Mostrar preview de la imagen actual (portada)
    setImagePreview(product.image_url || null);
    
    if (product.category_id) {
      loadSubcategories(product.category_id);
    }
    
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      try {
        const result = await productService.deleteProduct(product.id);
        if (result.success) {
          loadData();
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError('Error al eliminar el producto');
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: '',
      rating: '',
      reviews_count: '',
      image_url: '',
      category_id: '',
      subcategory_id: '',
      stock: '',
      is_featured: false,
      is_active: true,
      sku: '',
      weight: '',
      specifications: [],
      tags: [],
      product_images: []
    });
    setSubcategories([]);
    setImagePreview(null);
    setError(null);
  };

  const openModal = () => {
    resetForm();
    setEditingProduct(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    resetForm();
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <LoadingSpinner size="lg" color="gradient" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Administración de Productos
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Gestiona tu catálogo de productos
              </p>
            </div>
            <button
              onClick={openModal}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <CubeIcon className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Destacados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.featuredProducts || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <TagIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stock Bajo</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lowStockProducts || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(stats.totalValue || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedSubcategory('');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.image_url || '/placeholder-product.png'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            SKU: {product.sku || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {product.categories?.name || 'Sin categoría'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {product.subcategories?.name || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </div>
                      {product.discount > 0 && (
                        <div className="text-xs text-red-500 line-through">
                          {formatPrice(product.price)}
                        </div>
                      )}
                      {product.discount > 0 && (
                        <div className="text-xs font-semibold text-green-600">
                          {formatPrice(discountedPrice(product.price, product.discount))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock === 0 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : product.stock < 10
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.is_active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                        {product.is_featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            Destacado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando{' '}
                    <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>
                    {' '}a{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, totalProducts)}
                    </span>
                    {' '}de{' '}
                    <span className="font-medium">{totalProducts}</span>
                    {' '}resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:border-indigo-400 dark:text-indigo-300'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de producto */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        if (!editingProduct) {
                          const categoryName = categories.find(c => c.id === formData.category_id)?.name || '';
                          setFormData(prev => ({ ...prev, name: newName, sku: generateSKU(newName, categoryName) }));
                        } else {
                          setFormData(prev => ({ ...prev, name: newName }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SKU
                      {!editingProduct && <span className="ml-2 text-xs text-indigo-500 font-normal">Auto-generado</span>}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="Ej: LAP-ASUS-12345"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      {!editingProduct && (
                        <button
                          type="button"
                          title="Regenerar SKU"
                          onClick={() => {
                            const categoryName = categories.find(c => c.id === formData.category_id)?.name || '';
                            setFormData(prev => ({ ...prev, sku: generateSKU(prev.name, categoryName) }));
                          }}
                          className="px-2 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                        >
                          <ArrowPathIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Precio *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descuento (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Categoría *
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subcategoría
                    </label>
                    <select
                      value={formData.subcategory_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, subcategory_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Seleccionar subcategoría</option>
                      {subcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Galería de Imágenes
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => document.getElementById('image-upload').click()}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 flex items-center"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Subir archivo
                        </button>
                        <button
                          type="button"
                          onClick={addImageUrl}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 flex items-center"
                        >
                          <PhotoIcon className="h-4 w-4 mr-1" />
                          Agregar URL
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl min-h-[120px]">
                      {formData.product_images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                          <img
                            src={img.image_url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay for actions */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(idx)}
                              className={`p-1.5 rounded-full ${img.is_primary || img.image_url === formData.image_url ? 'bg-green-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                              title="Establecer como principal"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-500"
                              title="Eliminar imagen"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                          {/* Primary badge */}
                          {(img.is_primary || img.image_url === formData.image_url) && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                              PORTADA
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {uploadingImage && (
                        <div className="aspect-square rounded-lg border border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 flex flex-col items-center justify-center animate-pulse">
                          <LoadingSpinner size="sm" color="indigo" />
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">Cisterna...</span>
                        </div>
                      )}

                      {!uploadingImage && formData.product_images.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-4 text-gray-400 dark:text-gray-500">
                          <PhotoIcon className="h-8 w-8 mb-1" />
                          <p className="text-xs">No hay imágenes seleccionadas</p>
                        </div>
                      )}
                    </div>
                    
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="mt-2 text-[10px] text-gray-500 dark:text-gray-400">
                      Sugerencia: Usa imágenes de 1000x1000px. La primera imagen será la portada.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descripción
                    </label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Características Técnicas (Ficha Técnica)
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, specifications: [...p.specifications, {key: '', value: ''}] }))}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 flex items-center"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Agregar detalle
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.specifications.map((spec, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Ej: RAM, Marca, Sistema Operativo"
                            value={spec.key}
                            onChange={(e) => {
                              const newSpecs = [...formData.specifications];
                              newSpecs[idx].key = e.target.value;
                              setFormData(p => ({ ...p, specifications: newSpecs }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Ej: 16GB, Apple, Windows 11"
                            value={spec.value}
                            onChange={(e) => {
                              const newSpecs = [...formData.specifications];
                              newSpecs[idx].value = e.target.value;
                              setFormData(p => ({ ...p, specifications: newSpecs }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newSpecs = formData.specifications.filter((_, i) => i !== idx);
                            setFormData(p => ({ ...p, specifications: newSpecs }));
                          }}
                          className="p-2 mt-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          title="Eliminar característica"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    {formData.specifications.length === 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic py-2">
                        No has agregado características. Haz clic en "Agregar detalle" para incluir especificaciones como capacidad, marca, color, etc.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Producto destacado</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Activo</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            <div className="flex items-center">
              <XMarkIcon className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}