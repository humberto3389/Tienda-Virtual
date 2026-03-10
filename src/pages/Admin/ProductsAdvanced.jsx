import { useState, useEffect } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  TagIcon,
  StarIcon,
  CurrencyDollarIcon,
  CubeIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import { productService } from '../../services/productService';
import { storageService } from '../../services/storageService';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatPrice } from '../../utils/formatPrice';

export default function AdminProductsAdvanced() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [stats, setStats] = useState({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [dynamicAttributes, setDynamicAttributes] = useState([]);

  // Estados del formulario completo
  const [formData, setFormData] = useState({
    // Información básica
    name: '',
    slug: '',
    description: '',
    short_description: '',
    sku: '',
    barcode: '',
    mpn: '',
    
    // Precios
    price: '',
    compare_price: '',
    cost_price: '',
    discount: '',
    
    // Categorización
    category_id: '',
    subcategory_id: '',
    brand_id: '',
    
    // Inventario
    stock: '',
    low_stock_threshold: 10,
    track_quantity: true,
    allow_backorder: false,
    
    // Estado
    is_featured: false,
    is_active: true,
    is_digital: false,
    
    // Físico
    weight: '',
    length: '',
    width: '',
    height: '',
    
    // Especificaciones
    specifications: {},
    features: [],
    tags: [],
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    seo_title: '',
    seo_description: '',
    
    // Imágenes
    image_url: '',
    gallery_images: [],
    
    // Campos personalizados
    custom_fields: {}
  });

  useEffect(() => {
    loadData();
  }, [currentPage, searchQuery, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar productos
      const productsResult = await productService.getProducts({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        category: selectedCategory
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

      // Cargar marcas
      const brandsResult = await productService.getBrands();
      if (brandsResult.success) {
        setBrands(brandsResult.data);
      }

      // Cargar atributos
      const attributesResult = await productService.getProductAttributes();
      if (attributesResult.success) {
        setAttributes(attributesResult.data);
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

  const handleCategoryChange = async (categoryId) => {
    setFormData(prev => ({ ...prev, category_id: categoryId, subcategory_id: '' }));
    loadSubcategories(categoryId);
    
    // Cargar atributos dinámicos segun categoría
    if (categoryId) {
      const result = await productService.getAttributesByCategory(categoryId);
      if (result.success) {
        setDynamicAttributes(result.data);
        // Inicializar specs vacías si es nuevo
        const initialSpecs = {};
        result.data.forEach(attr => {
          initialSpecs[attr.name] = '';
        });
        setFormData(prev => ({
          ...prev,
          specifications: { ...initialSpecs, ...prev.specifications }
        }));
      }
    }
  };

  const handleMultipleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validar archivos
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Las imágenes no pueden ser mayores a 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      setUploadingImages(true);
      setError(null);

      // Crear previews
      const previews = await Promise.all(
        validFiles.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        })
      );

      setImagePreviews(prev => [...prev, ...previews]);

      // Subir imágenes
      const imageUrls = await storageService.uploadMultipleProductImages(validFiles);
      
      // Actualizar el formulario
      setFormData(prev => ({
        ...prev,
        image_url: imageUrls[0] || prev.image_url, // Primera imagen como principal
        gallery_images: [...prev.gallery_images, ...imageUrls]
      }));
      
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Error al subir las imágenes. Inténtalo de nuevo.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
      image_url: index === 0 ? prev.gallery_images[1] || '' : prev.image_url
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Procesar datos del formulario
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        compare_price: parseFloat(formData.compare_price) || null,
        cost_price: parseFloat(formData.cost_price) || null,
        discount: parseFloat(formData.discount) || 0,
        stock: parseInt(formData.stock) || 0,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 10,
        weight: parseFloat(formData.weight) || null,
        length: parseFloat(formData.length) || null,
        width: parseFloat(formData.width) || null,
        height: parseFloat(formData.height) || null,
        specifications: typeof formData.specifications === 'string' 
          ? JSON.parse(formData.specifications || '{}') 
          : formData.specifications,
        features: Array.isArray(formData.features) 
          ? formData.features 
          : formData.features.split(',').map(f => f.trim()).filter(f => f),
        tags: Array.isArray(formData.tags) 
          ? formData.tags 
          : formData.tags.split(',').map(t => t.trim()).filter(t => t),
        meta_keywords: Array.isArray(formData.meta_keywords) 
          ? formData.meta_keywords 
          : formData.meta_keywords.split(',').map(k => k.trim()).filter(k => k),
        custom_fields: typeof formData.custom_fields === 'string' 
          ? JSON.parse(formData.custom_fields || '{}') 
          : formData.custom_fields
      };

      let result;
      if (editingProduct) {
        result = await productService.updateProduct(editingProduct.id, productData);
      } else {
        result = await productService.createProduct(productData);
      }

      if (result.success) {
        const productId = result.data.id;
        
        // Guardar variantes si existen
        if (formData.variants && formData.variants.length > 0) {
          await Promise.all(formData.variants.map(variant => 
            productService.createProductVariant({
              ...variant,
              product_id: productId,
              price_override: parseFloat(variant.price_override) || null,
              stock: parseInt(variant.stock) || 0
            })
          ));
        }

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

  const handleEdit = async (product) => {
    setEditingProduct(product);
    
    // Cargar variantes si existen
    let productVariants = [];
    const variantsResult = await productService.getProductVariants(product.id);
    if (variantsResult.success) {
      productVariants = variantsResult.data;
    }

    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      short_description: product.short_description || '',
      sku: product.sku || '',
      barcode: product.barcode || '',
      mpn: product.mpn || '',
      price: product.price || '',
      compare_price: product.compare_price || '',
      cost_price: product.cost_price || '',
      discount: product.discount || '',
      category_id: product.category_id || '',
      subcategory_id: product.subcategory_id || '',
      brand_id: product.brand_id || '',
      stock: product.stock || '',
      low_stock_threshold: product.low_stock_threshold || 10,
      track_quantity: product.track_quantity !== false,
      allow_backorder: product.allow_backorder || false,
      is_featured: product.is_featured || false,
      is_active: product.is_active !== false,
      is_digital: product.is_digital || false,
      weight: product.weight || '',
      length: product.length || '',
      width: product.width || '',
      height: product.height || '',
      specifications: product.specifications || {},
      features: Array.isArray(product.features) ? product.features.join(', ') : product.features || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || '',
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
      meta_keywords: Array.isArray(product.meta_keywords) ? product.meta_keywords.join(', ') : product.meta_keywords || '',
      seo_title: product.seo_title || '',
      seo_description: product.seo_description || '',
      image_url: product.image_url || '',
      gallery_images: product.gallery_images || [],
      custom_fields: product.custom_fields || {},
      variants: productVariants
    });
    
    // Mostrar preview de imágenes actuales
    setImagePreviews(product.gallery_images || [product.image_url].filter(Boolean));
    
    if (product.category_id) {
      loadSubcategories(product.category_id);
      // Cargar especificaciones dinámicas
      const result = await productService.getAttributesByCategory(product.category_id);
      if (result.success) {
        setDynamicAttributes(result.data);
      }
    }
    
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      short_description: '',
      sku: '',
      barcode: '',
      mpn: '',
      price: '',
      compare_price: '',
      cost_price: '',
      discount: '',
      category_id: '',
      subcategory_id: '',
      brand_id: '',
      stock: '',
      low_stock_threshold: 10,
      track_quantity: true,
      allow_backorder: false,
      is_featured: false,
      is_active: true,
      is_digital: false,
      weight: '',
      length: '',
      width: '',
      height: '',
      specifications: {},
      features: [],
      tags: [],
      meta_title: '',
      meta_description: '',
      meta_keywords: [],
      seo_title: '',
      seo_description: '',
      image_url: '',
      gallery_images: [],
      custom_fields: {}
    });
    setSubcategories([]);
    setImagePreviews([]);
    setError(null);
    setActiveTab('basic');
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

  const tabs = [
    { id: 'basic', name: 'Básico', icon: DocumentTextIcon },
    { id: 'pricing', name: 'Precios', icon: CurrencyDollarIcon },
    { id: 'inventory', name: 'Inventario', icon: CubeIcon },
    { id: 'images', name: 'Imágenes', icon: PhotoIcon },
    { id: 'variants', name: 'Variantes', icon: ListBulletIcon },
    { id: 'seo', name: 'SEO', icon: CogIcon },
    { id: 'advanced', name: 'Avanzado', icon: Cog6ToothIcon }
  ];

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
                Administración Avanzada de Productos
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Sistema completo de e-commerce con todos los detalles
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
                        <div className="text-sm text-red-600">
                          -{product.discount}%
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de producto avanzado */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-4 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white dark:bg-gray-800 max-h-[95vh] overflow-y-auto">
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

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tab: Información Básica */}
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nombre del Producto *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Slug
                        </label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="se-genera-automaticamente"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Código de Barras
                        </label>
                        <input
                          type="text"
                          value={formData.barcode}
                          onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Marca
                        </label>
                        <select
                          value={formData.brand_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, brand_id: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Seleccionar marca</option>
                          {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descripción Corta
                      </label>
                      <textarea
                        rows="2"
                        value={formData.short_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Descripción breve del producto..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descripción Completa
                      </label>
                      <textarea
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Descripción detallada del producto..."
                      />
                    </div>
                  </div>
                )}

                {/* Tab: Precios */}
                {activeTab === 'pricing' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Precio de Venta *
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
                          Precio de Comparación
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.compare_price}
                          onChange={(e) => setFormData(prev => ({ ...prev, compare_price: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Precio original (tachado)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Precio de Costo
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.cost_price}
                          onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Para cálculo de márgenes"
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
                    </div>
                  </div>
                )}

                {/* Tab: Inventario */}
                {activeTab === 'inventory' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Stock Disponible *
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
                          Umbral de Stock Bajo
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.low_stock_threshold}
                          onChange={(e) => setFormData(prev => ({ ...prev, low_stock_threshold: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.track_quantity}
                          onChange={(e) => setFormData(prev => ({ ...prev, track_quantity: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Rastrear cantidad</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.allow_backorder}
                          onChange={(e) => setFormData(prev => ({ ...prev, allow_backorder: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Permitir pedidos pendientes</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Tab: Imágenes */}
                {activeTab === 'images' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Imágenes del Producto
                      </label>
                      
                      {/* Preview de imágenes */}
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                              {index === 0 && (
                                <span className="absolute bottom-2 left-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded">
                                  Principal
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Input de carga de archivos */}
                      <div className="relative">
                        <input
                          id="multiple-image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleMultipleImageUpload}
                          disabled={uploadingImages}
                          className="hidden"
                        />
                        <label
                          htmlFor="multiple-image-upload"
                          className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors ${
                            uploadingImages ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {uploadingImages ? (
                            <div className="flex items-center">
                              <LoadingSpinner size="sm" color="white" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Subiendo imágenes...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Arrastra imágenes aquí o haz clic para seleccionar
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Formatos: JPG, PNG, GIF. Máximo 5MB por imagen
                              </span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: SEO */}
                {activeTab === 'seo' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Título SEO
                      </label>
                      <input
                        type="text"
                        value={formData.seo_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Título optimizado para buscadores"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descripción SEO
                      </label>
                      <textarea
                        rows="3"
                        value={formData.seo_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Descripción para buscadores (máximo 160 caracteres)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Palabras Clave
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(formData.meta_keywords) ? formData.meta_keywords.join(', ') : formData.meta_keywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="palabra1, palabra2, palabra3"
                      />
                    </div>
                  </div>
                )}

                {/* Tab: Avanzado */}
                {activeTab === 'advanced' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.weight}
                          onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Largo (cm)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.length}
                          onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Ancho (cm)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.width}
                          onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Alto (cm)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.height}
                          onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Características (separadas por comas)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(formData.features) ? formData.features.join(', ') : formData.features}
                        onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Característica 1, Característica 2, Característica 3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tags (separados por comas)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="tag1, tag2, tag3"
                      />
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

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.is_digital}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_digital: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Producto digital</span>
                      </label>
                    </div>

                    {/* Especificaciones Dinámicas (Tech Store) */}
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Especificaciones Técnicas</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dynamicAttributes.length > 0 ? (
                          dynamicAttributes.map(attr => (
                            <div key={attr.id}>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {attr.name}
                              </label>
                              <select
                                value={formData.specifications[attr.name] || ''}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  specifications: { ...prev.specifications, [attr.name]: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                              >
                                <option value="">Seleccionar {attr.name}</option>
                                {attr.values?.map(val => (
                                  <option key={val.id} value={val.value}>{val.value}</option>
                                ))}
                                <option value="custom">+ Valor personalizado</option>
                              </select>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic col-span-2">Selecciona una categoría para ver atributos sugeridos.</p>
                        )}
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Otras especificaciones (JSON)
                          </label>
                          <textarea
                            rows="4"
                            value={typeof formData.specifications === 'string' ? formData.specifications : JSON.stringify(formData.specifications, null, 2)}
                            onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-xs focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder='{"RAM": "16GB", "CPU": "Ryzen 7"}'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
