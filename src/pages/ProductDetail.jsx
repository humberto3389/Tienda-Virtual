import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  StarIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
  PhotoIcon,
  CubeIcon,
  CurrencyDollarIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  CpuChipIcon,
  CommandLineIcon,
  SwatchIcon,
  ScaleIcon,
  HashtagIcon,
  WrenchScrewdriverIcon,
  DevicePhoneMobileIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { productService } from '../services/productService';
import { whatsappConfig, openWhatsApp } from '../config/whatsapp';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';
import ProductRatingModal from '../components/ProductRatingModal';
import { formatPrice, discountedPrice } from '../utils/formatPrice';
import SpecTag from '../components/ui/SpecTag';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [productOpinions, setProductOpinions] = useState([]);
  const [loadingOpinions, setLoadingOpinions] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (id) {
      loadProduct();
      loadProductOpinions();
      loadRatingStats();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await productService.getProductById(id);
      
      if (result.success) {
        setProduct(result.data);
        setSelectedImage(0);
        setSelectedVariant(null);
        loadRelatedProducts(result.data.category_id);
      } else {
        setError('Producto no encontrado');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const loadProductOpinions = async () => {
    try {
      setLoadingOpinions(true);
      const result = await productService.getProductOpinions(id);
      
      if (result.success) {
        setProductOpinions(result.data);
      }
    } catch (error) {
      console.error('Error loading product opinions:', error);
    } finally {
      setLoadingOpinions(false);
    }
  };

  const loadRatingStats = async () => {
    try {
      const result = await productService.getProductRatingStats(id);
      
      if (result.success) {
        setRatingStats(result.data);
      }
    } catch (error) {
      console.error('Error loading rating stats:', error);
    }
  };

  const loadRelatedProducts = async (categoryId) => {
    try {
      const result = await productService.getProducts({
        category: categoryId,
        limit: 4,
        featured: null
      });

      if (result.success) {
        // Filtrar el producto actual
        const filtered = result.data.filter(p => p.id !== id);
        setRelatedProducts(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const generatePurchaseMessage = () => {
    const finalPrice = product.price * (1 - (product.discount || 0) / 100);
    const totalPrice = finalPrice * quantity;
    
    let message = `🛒 *SOLICITUD DE COMPRA*\n\n`;
    message += `¡Hola! Quiero solicitar la compra de este producto:\n\n`;
    message += `📦 *${product.name}*\n`;
    message += `💰 Precio unitario: ${formatPrice(finalPrice)}\n`;
    message += `📊 Cantidad solicitada: ${quantity}\n`;
    message += `💵 *Total a pagar: ${formatPrice(totalPrice)}*\n\n`;
    
    if (product.description) {
      message += `📝 Descripción: ${product.description.substring(0, 150)}${product.description.length > 150 ? '...' : ''}\n\n`;
    }
    
    if (product.categories?.name) {
      message += `🏷️ Categoría: ${product.categories.name}\n`;
    }
    
    if (product.sku) {
      message += `🔢 SKU: ${selectedVariant?.sku || product.sku}\n`;
    }
    
    if (selectedVariant) {
      message += `⚙️ Configuración: ${selectedVariant.name}\n`;
    }
    
    message += `\n🔗 Ver producto: ${window.location.href}\n\n`;
    message += `Por favor, confírmame:\n`;
    message += `• Disponibilidad del producto\n`;
    message += `• Formas de pago disponibles\n`;
    message += `• Costo de envío\n`;
    message += `• Tiempo de entrega\n\n`;
    message += `¡Gracias! 🙏`;
    
    return message;
  };

  const generateInquiryMessage = () => {
    const finalPrice = product.price * (1 - (product.discount || 0) / 100);
    
    let message = `❓ *CONSULTA SOBRE PRODUCTO*\n\n`;
    message += `¡Hola! Me interesa este producto y tengo algunas consultas:\n\n`;
    message += `📦 *${product.name}*\n`;
    message += `💰 Precio: ${formatPrice(finalPrice)}\n`;
    
    if (product.discount > 0) {
      message += `🎯 Descuento: ${product.discount}% (Precio original: ${formatPrice(product.price)})\n`;
    }
    
    if (product.description) {
      message += `📝 Descripción: ${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}\n`;
    }
    
    if (product.categories?.name) {
      message += `🏷️ Categoría: ${product.categories.name}\n`;
    }
    
    message += `\n🔗 Ver producto: ${window.location.href}\n\n`;
    message += `Me gustaría saber:\n`;
    message += `• ¿Tienen stock disponible?\n`;
    message += `• ¿Hay descuentos por cantidad?\n`;
    message += `• ¿Qué garantía incluye?\n`;
    message += `• ¿Hacen envíos a mi zona?\n\n`;
    message += `¡Gracias por la información! 😊`;
    
    return message;
  };

  const handleWhatsAppContact = () => {
    const basePrice = selectedVariant?.price_override || product.price;
    const variantFinalPrice = discountedPrice(basePrice, product.discount || 0);
    const totalPrice = variantFinalPrice * quantity;
    
    let message = `🛒 *SOLICITUD DE COMPRA*\n\n`;
    message += `¡Hola! Quiero solicitar la compra de este producto:\n\n`;
    message += `📦 *${product.name}*\n`;
    if (selectedVariant) {
      message += `⚙️ Configuración: ${selectedVariant.name}\n`;
      message += `🔢 SKU: ${selectedVariant.sku || product.sku}\n`;
    } else {
      message += `🔢 SKU: ${product.sku}\n`;
    }
    const totalAmount = finalPrice * quantity;
    message += `💰 Precio unitario: ${formatPrice(finalPrice)}\n`;
    message += `📊 Cantidad solicitada: ${quantity}\n`;
    message += `💵 *Total a pagar: ${formatPrice(totalAmount)}*\n\n`;
    message += `🔗 Ver producto: ${window.location.href}\n\n`;
    message += `Por favor, confírmame:\n`;
    message += `• Disponibilidad del producto\n`;
    message += `• Formas de pago disponibles\n`;
    message += `• Costo de envío\n`;
    message += `• Tiempo de entrega\n\n`;
    message += `¡Gracias! 🙏`;
    
    // Detectar si es móvil o desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let whatsappUrl;
    if (isMobile) {
      // Para móviles, usar wa.me
      whatsappUrl = `https://wa.me/51973295101?text=${encodeURIComponent(message)}`;
    } else {
      // Para desktop, usar web.whatsapp.com
      whatsappUrl = `https://web.whatsapp.com/send?phone=51973295101&text=${encodeURIComponent(message)}`;
    }
    
    console.log('Dispositivo:', isMobile ? 'Móvil' : 'Desktop');
    console.log('Mensaje de compra:', message);
    console.log('URL de WhatsApp:', whatsappUrl);
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleWhatsAppInquiry = () => {
    const basePrice = selectedVariant?.price_override || product.price;
    const variantFinalPrice = discountedPrice(basePrice, product.discount || 0);
    
    let message = `❓ *CONSULTA SOBRE PRODUCTO*\n\n`;
    message += `¡Hola! Me interesa este producto y tengo algunas consultas:\n\n`;
    message += `📦 *${product.name}*\n`;
    if (selectedVariant) {
      message += `⚙️ Configuración: ${selectedVariant.name}\n`;
    }
    message += `💰 Precio: ${formatPrice(finalPrice)}\n\n`;
    message += `🔗 Ver producto: ${window.location.href}\n\n`;
    message += `Me gustaría saber:\n`;
    message += `• ¿Tienen stock disponible?\n`;
    message += `• ¿Hay descuentos por cantidad?\n`;
    message += `• ¿Qué garantía incluye?\n`;
    message += `• ¿Hacen envíos a mi zona?\n\n`;
    message += `¡Gracias por la información! 😊`;
    
    // Detectar si es móvil o desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let whatsappUrl;
    if (isMobile) {
      // Para móviles, usar wa.me
      whatsappUrl = `https://wa.me/51973295101?text=${encodeURIComponent(message)}`;
    } else {
      // Para desktop, usar web.whatsapp.com
      whatsappUrl = `https://web.whatsapp.com/send?phone=51973295101&text=${encodeURIComponent(message)}`;
    }
    
    console.log('Dispositivo:', isMobile ? 'Móvil' : 'Desktop');
    console.log('Mensaje de consulta:', message);
    console.log('URL de WhatsApp:', whatsappUrl);
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href);
      // Aquí podrías mostrar un toast de confirmación
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <StarSolidIcon className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-yellow-400" />);
      }
    }

    return stars;
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { text: 'Agotado', color: 'text-red-600 bg-red-100', icon: XMarkIcon };
    } else if (product.stock < 10) {
      return { text: `Solo ${product.stock} disponibles`, color: 'text-orange-600 bg-orange-100', icon: TagIcon };
    } else {
      return { text: 'En stock', color: 'text-green-600 bg-green-100', icon: CheckIcon };
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" color="gradient" />
    </div>
  );

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Producto no encontrado'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus();
  const basePrice = selectedVariant?.price_override || product.price;
  const finalPrice = basePrice * (1 - (product.discount || 0) / 100);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#121212] text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-[10px] tracking-widest uppercase opacity-40 mb-12">
          <Link to="/" className="hover:text-[#00E5FF] transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#00E5FF] transition-colors">Tienda</Link>
          <span>/</span>
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>{product.name}</span>
        </nav>

        {/* Botón de regreso */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800 relative group">
              <img
                src={(selectedImage === 0 ? product.image_url : product.product_images[selectedImage - 1]?.image_url) || '/placeholder-product.png'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            
            {/* Miniaturas */}
            {product.product_images && product.product_images.length > 0 && (
              <div className="grid grid-cols-5 gap-3">
                <button
                  onClick={() => setSelectedImage(0)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === 0 ? 'border-[#00E5FF] scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                {product.product_images.map((image, index) => (
                    <button
                    key={image.id || index}
                    onClick={() => setSelectedImage(index + 1)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index + 1 ? 'border-[#00E5FF] scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                      src={image.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className={`space-y-8 lg:sticky lg:top-28 h-fit p-6 sm:p-8 rounded-xl border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-100'}`}>

            {/* Header */}
                <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-[#00E5FF]">
                  {product.categories?.name} {product.subcategories?.name && <span className="mx-2 opacity-30">•</span>} {product.subcategories?.name}
                </span>
                <button
                  onClick={toggleFavorite}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
              
              <h1 className={`text-4xl lg:text-5xl font-black tracking-tight mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center">
                  {renderStars(ratingStats.averageRating)}
                </div>
                <span className="text-xs opacity-50">
                  {ratingStats.averageRating} ({ratingStats.totalReviews} reseñas)
                </span>
                </div>

              {/* Precio */}
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-3xl font-light text-[#00E5FF]">
                  {formatPrice(finalPrice)}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xl opacity-30 line-through font-light">
                      {formatPrice(basePrice)}
                    </span>
                    <span className="bg-[#FF854D] text-white text-[10px] tracking-widest px-3 py-1 rounded-full font-medium">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Descripción */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Descripción
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center space-x-2">
              <stockStatus.icon className="h-5 w-5" />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                {selectedVariant ? (selectedVariant.stock > 0 ? `En stock (${selectedVariant.stock})` : 'Agotado') : stockStatus.text}
              </span>
            </div>

            {/* Selector de Variantes (Tech Store) */}
            {product.product_variants && product.product_variants.length > 0 && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Seleccionar configuración:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.product_variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedVariant?.id === v.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-500'
                      }`}
                    >
                      {v.name} {v.price_override && `(+ ${formatPrice(v.price_override - product.price)})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad y botones */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cantidad:
                </span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Botón de calificar */}
                <button
                  onClick={() => setShowRatingModal(true)}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium`}
                >
                  <StarIcon className="h-5 w-5 mr-2" />
                  Calificar este producto
                </button>
                
                {/* Botones de WhatsApp */}
                <div className="flex flex-col space-y-3 pt-4">
                  <button
                    onClick={handleWhatsAppContact}
                    disabled={product.stock === 0}
                    className="w-full py-4 px-6 rounded-full bg-[#00E5FF] hover:bg-[#2e7dda] text-white font-bold text-lg shadow-lg flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none"
                  >
                    {product.stock === 0 ? 'CONSULTAR STOCK' : 'SOLICITAR POR WHATSAPP'}
                  </button>
                  <button
                    onClick={handleWhatsAppInquiry}
                    className={`w-full py-4 px-6 rounded-full border flex items-center justify-center font-medium transition-all ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    Hacer una consulta rápida
                  </button>
                </div>
              </div>
            </div>

            {/* Características */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Consultas por WhatsApp
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Productos originales
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CubeIcon className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.stock > 0 ? 'Disponible' : 'Consultar stock'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ShareIcon className="h-5 w-5 text-gray-600" />
                          <button
                  onClick={handleShare}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Compartir producto
                          </button>
              </div>
            </div>

            {/* Especificaciones / Ficha Técnica */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Ficha Técnica
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <SpecTag key={key} label={key} value={value} variant="large" />
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Etiquetas
                      </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                        ))}
                      </div>
                    </div>
                  )}
          </div>
        </div>

        {/* Opiniones del producto */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Opiniones de clientes ({productOpinions.length})
          </h2>
          
          {loadingOpinions ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" color="gradient" />
            </div>
          ) : productOpinions.length > 0 ? (
            <div className="space-y-6">
              {productOpinions.map((opinion) => (
                <div key={opinion.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start space-x-4">
                    <img
                      src={opinion.avatar}
                      alt={opinion.nombre}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {opinion.nombre}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {renderStars(opinion.rating)}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(opinion.fecha).toLocaleDateString('es-PE')}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {opinion.mensaje}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Aún no hay opiniones para este producto. ¡Sé el primero en opinar!
              </p>
            </div>
          )}
        </div>

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Productos relacionados
            </h2>
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  {/* Badge de descuento */}
                  {relatedProduct.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-[#FF854D] text-white text-[10px] px-3 py-1.5 rounded-full font-light tracking-wider z-10">
                      -{relatedProduct.discount}%
                    </div>
                  )}
                  {/* Badge de destacado */}
                  {relatedProduct.is_featured && (
                    <div className="absolute top-4 left-4 bg-[#37383F] text-white text-[10px] px-3 py-1.5 rounded-full font-light tracking-wider z-10">
                      DESTACADO
                    </div>
                  )}
                  
                  <div className="w-full bg-gray-200 aspect-w-1 aspect-h-1 overflow-hidden group-hover:opacity-75">
                    <img
                      src={relatedProduct.image_url || '/placeholder-product.png'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="mt-4 px-4 pb-4 flex flex-col flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#3F96FC] transition-colors line-clamp-2">
                      <Link to={`/product/${relatedProduct.id}`}>
                        {relatedProduct.name}
                      </Link>
                    </h3>
                    <div className="mt-1 flex items-center">
                      <div className="flex items-center">
                        {renderStars(relatedProduct.rating || ratingStats.averageRating || 0)}
                      </div>
                      <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({relatedProduct.reviews_count || 0} reseñas)
                      </p>
                    </div>

                    {/* Especificaciones Dinámicas (Tech Store) */}
                    {relatedProduct.specifications && Object.keys(relatedProduct.specifications).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {Object.entries(relatedProduct.specifications).slice(0, 4).map(([key, value]) => (
                          <SpecTag key={key} label={key} value={value} />
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div>
                        {relatedProduct.discount > 0 && (
                          <p className="text-[10px] text-gray-400 line-through mb-0.5">{formatPrice(relatedProduct.price)}</p>
                        )}
                        <p className="text-lg font-light text-gray-900 dark:text-white">
                          {formatPrice(discountedPrice(relatedProduct.price, relatedProduct.discount || 0))}
                        </p>
                      </div>
                      <div className="p-2 rounded-full transition-colors bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-[#3F96FC] group-hover:text-white dark:group-hover:bg-[#3F96FC] dark:group-hover:text-white">
                        <TagIcon className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-col gap-2">
                      <Link
                        to={`/product/${relatedProduct.id}`}
                        className="w-full flex justify-center items-center px-4 py-2 rounded-full text-xs font-light tracking-widest text-white bg-[#37383F] hover:bg-[#2a2b30] transition-all"
                      >
                        DETALLES
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {showSuccessMessage && (
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 mr-2" />
              ¡WhatsApp abierto! Te esperamos para ayudarte
            </div>
          </div>
        )}

        {/* Modal de calificación */}
        <ProductRatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          product={product}
          onSubmitSuccess={() => {
            // Recargar opiniones del producto después de enviar una nueva
            loadProductOpinions();
            // Recargar las estadísticas de rating
            loadRatingStats();
          }}
        />
      </div>
    </div>
  );
}