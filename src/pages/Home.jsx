import { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, ArrowRightIcon, ShoppingBagIcon, StarIcon, SparklesIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { formatPrice, discountedPrice } from '../utils/formatPrice';
import DarkModeWrapper from '@/components/ui/DarkModeWrapper';
import { opinionService } from '../services/opinionService';
import { productService } from '../services/productService';
import { supabase } from '../config/supabase';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';

const newsletterService = {
  subscribe: async (email) => {
    try {
      if (!email || !email.includes('@') || !email.includes('.')) {
        throw new Error('Por favor ingresa un correo electrónico válido');
      }

      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])
        .select();

      if (error) {
        if (error.code === '23505') {
          return { success: false, message: '¡Ya estás suscrito a nuestro newsletter!' };
        }
        throw error;
      }

      return { success: true, message: '¡Gracias por suscribirte! Pronto recibirás nuestras novedades.' };
    } catch (error) {
      console.error('Error al suscribirse:', error);
      return { success: false, message: error.message || 'Ocurrió un error al procesar tu suscripción' };
    }
  }
};

// Función para asignar gradientes a las categorías (ya no la usamos para mantener minimalismo "Carbon")

const defaultCategoryImages = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Laptops
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Phones
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Headphones
  "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Tablets/Accessories
  "https://images.unsplash.com/photo-1606220838315-056192d5e927?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Gaming
  "https://images.unsplash.com/photo-1527443154391-42721869e5fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Smartwatches
];

const getCategoryImage = (category, index) => {
  if (category.image_url) return category.image_url;

  if (!category.name) return defaultCategoryImages[index % defaultCategoryImages.length];

  const name = category.name.toLowerCase();
  if (name.includes('laptop') || name.includes('mac') || name.includes('computadora')) return defaultCategoryImages[0];
  if (name.includes('phone') || name.includes('celular') || name.includes('movil') || name.includes('iphone')) return defaultCategoryImages[1];
  if (name.includes('audio') || name.includes('auricular') || name.includes('sound')) return defaultCategoryImages[2];
  if (name.includes('tablet') || name.includes('ipad')) return defaultCategoryImages[3];
  if (name.includes('gaming') || name.includes('consola') || name.includes('play')) return defaultCategoryImages[4];
  if (name.includes('watch') || name.includes('reloj') || name.includes('wearable')) return defaultCategoryImages[5];

  return defaultCategoryImages[index % defaultCategoryImages.length];
};

import { homeService } from '../services/homeService';

const Home = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState({ text: '', type: '' });
  const [destacadas, setDestacadas] = useState([]);
  const [loadingDestacadas, setLoadingDestacadas] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeaturedProducts, setLoadingFeaturedProducts] = useState(true);
  const [realCategories, setRealCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { theme } = useTheme();

  const defaultHero = {
    title_primary: 'Piensa',
    title_secondary: 'Diferente.',
    subtitle: 'La innovación más avanzada en tus manos. Diseño sin concesiones, rendimiento absoluto.',
    badge: 'Nueva Era Tecnológica',
    button_primary_text: 'DESCUBRIR COLECCIÓN',
    button_primary_url: '/shop',
    media_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop",
    media_type: 'image'
  };

  const [heroData, setHeroData] = useState(defaultHero);
  const [loadingHero, setLoadingHero] = useState(true);

  // Cargar datos del Hero
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const result = await homeService.getHeroData();
        if (result.success && result.data) {
          setHeroData(result.data);
        }
      } catch (error) {
        console.error('Error loading hero data:', error);
      } finally {
        setLoadingHero(false);
      }
    };
    fetchHero();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const result = await newsletterService.subscribe(email);

    setSubscriptionMessage({
      text: result.message,
      type: result.success ? 'success' : 'error'
    });

    setIsSubmitting(false);

    setTimeout(() => {
      setSubscriptionMessage({ text: '', type: '' });
    }, 5000);

    if (result.success) {
      setEmail('');
    }
  };

  useEffect(() => {
    const cargarDestacadas = async () => {
      try {
        const data = await opinionService.getOpinionesDestacadas();
        setDestacadas(data);
      } catch (error) {
        console.error('Error cargando opiniones destacadas:', error);
      } finally {
        setLoadingDestacadas(false);
      }
    };
    cargarDestacadas();
  }, []);

  // Cargar productos destacados
  useEffect(() => {
    const cargarProductosDestacados = async () => {
      try {
        setLoadingFeaturedProducts(true);
        const result = await productService.getProducts({
          page: 1,
          limit: 8,
          featured: true
        });

        if (result.success) {
          const products = result.data;

          // Cargar estadísticas de rating para cada producto
          const productIds = products.map(p => p.id);
          const ratingStatsResult = await productService.getMultipleProductsRatingStats(productIds);

          if (ratingStatsResult.success) {
            // Combinar productos con sus estadísticas de rating
            const productsWithStats = products.map(product => ({
              ...product,
              rating: ratingStatsResult.data[product.id]?.averageRating || product.rating || 0,
              reviews_count: ratingStatsResult.data[product.id]?.totalReviews || product.reviews_count || 0
            }));

            setFeaturedProducts(productsWithStats);
          } else {
            setFeaturedProducts(products);
          }
        } else {
          console.error('Error cargando productos destacados:', result.error);
        }
      } catch (error) {
        console.error('Error cargando productos destacados:', error);
      } finally {
        setLoadingFeaturedProducts(false);
      }
    };
    cargarProductosDestacados();
  }, []);

  // Cargar categorías reales
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setLoadingCategories(true);
        const result = await productService.getCategories();

        if (result.success) {
          setRealCategories(result.data);
        } else {
          console.error('Error cargando categorías:', result.error);
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    cargarCategorias();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] selection:bg-[#00E5FF]/30 transition-colors duration-700">
      {/* 1. MONUMENTAL HERO */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Magic Glow Orbs for Dark Mode - Disabled on mobile for performance */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#00E5FF]/10 blur-[150px] rounded-full pointer-events-none md:block hidden animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[#FF854D]/10 blur-[150px] rounded-full pointer-events-none md:block hidden animate-pulse" style={{animationDelay: '1s'}}></div>
        {/* Abstract Background / Parallax Feel */}
        <div className="absolute inset-0 z-0">
          {(heroData || defaultHero) && (
            (heroData?.media_type || defaultHero.media_type) === 'video' ? (
              <video
                src={heroData?.media_url || defaultHero.media_url}
                autoPlay
                loop
                muted
                playsInline
                fetchpriority="high"
                className="w-full h-full object-cover opacity-[0.85] dark:opacity-50 object-center transform scale-105"
              />
            ) : (
              <img
                src={`${(heroData?.media_url || defaultHero.media_url).includes('?') ? (heroData?.media_url || defaultHero.media_url) : (heroData?.media_url || defaultHero.media_url) + '?auto=format&fit=crop'}&w=${window.innerWidth > 768 ? 1920 : 800}&q=80`}
                alt="Hero background"
                fetchpriority="high"
                className="w-full h-full object-cover opacity-[0.85] dark:opacity-50 object-center transform scale-105"
              />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white dark:to-[#0a0a0f]"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/5 via-transparent to-[#FF854D]/5 dark:block hidden"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <span className="inline-block py-2 px-5 border border-white/20 rounded-full text-white/90 text-[10px] tracking-[0.4em] font-medium mb-8 backdrop-blur-md bg-white/5 uppercase animate-fade-in-up">
            {heroData?.badge || 'Nueva Era Tecnológica'}
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-light tracking-tighter leading-none mb-8 text-black dark:text-white">
            <span className="block opacity-90 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              {heroData?.title_primary || 'Piensa'}
            </span>
            <span className="block font-medium bg-gradient-to-r from-[#00E5FF] to-[#FF854D] bg-clip-text text-transparent animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              {heroData?.title_secondary || 'Diferente.'}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-light max-w-2xl mx-auto mb-14 tracking-wide leading-relaxed animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            {heroData?.subtitle || 'La innovación más avanzada en tus manos. Diseño sin concesiones, rendimiento absoluto.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to={heroData?.button_primary_url || "/shop"} className="group relative px-12 py-5 bg-white text-black rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <span className="relative z-10 flex items-center text-[11px] tracking-[0.2em] font-medium">
                {heroData?.button_primary_text || 'DESCUBRIR COLECCIÓN'} <ArrowRightIcon className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            {heroData?.button_secondary_text && (
              <Link to={heroData?.button_secondary_url || "/servicios"} className="group relative px-12 py-5 border border-black/10 dark:border-white/10 text-black dark:text-white rounded-full overflow-hidden transition-all hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <span className="relative z-10 flex items-center text-[11px] tracking-[0.2em] font-medium">
                  {heroData.button_secondary_text}
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS (Minimalist scroll) */}
      <section className="py-8 bg-white dark:bg-[#0a0a0f] border-b border-gray-100 dark:border-white/5 relative z-20 transition-colors duration-500">
        <div className="container mx-auto px-6">
          {loadingCategories ? (
            <div className="flex justify-center"><LoadingSpinner size="sm" /></div>
          ) : (
            <div className="flex overflow-x-auto no-scrollbar gap-10 md:justify-center px-4 py-2">
              <Link
                to="/shop"
                className="whitespace-nowrap text-xs font-medium tracking-[0.2em] uppercase text-black dark:text-white"
              >
                TODO
              </Link>
              {realCategories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="whitespace-nowrap text-xs font-light tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. EDITORIAL PRODUCTS (Zig-Zag) */}
      <section className="py-32 md:py-48 bg-white dark:bg-[#18181b]">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="mb-32 md:mb-48 md:text-center">
            <h2 className="text-5xl md:text-7xl font-light text-black dark:text-white tracking-tighter">
              Lo Mejor <span className="font-semibold bg-gradient-to-r from-[#00E5FF] to-[#FF854D] bg-clip-text text-transparent">de la Tecnología.</span>
            </h2>
            <p className="mt-6 text-xl text-gray-500 font-light tracking-wide max-w-2xl md:mx-auto">
              Cada pieza seleccionada representa el pináculo de la ingeniería moderna y el diseño estético.
            </p>
          </div>

          {loadingFeaturedProducts ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" color="gradient" /></div>
          ) : (
            <div className="space-y-40 md:space-y-64">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div key={product.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 lg:gap-32`}>

                  {/* Image Side */}
                  <div className="w-full md:w-[55%]">
                    <Link to={`/product/${product.id}`} className="block group relative w-full aspect-[4/5] md:aspect-square overflow-hidden rounded-[2.5rem] bg-[#F5F5F7] dark:bg-[#111]">
                      {/* Fondo de reacción suave */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5F7] to-[#EDEDEF] dark:from-[#111] dark:to-[#18181b] transition-all duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"></div>

                      <img
                        src={`${product.image_url || 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop'}&w=800&q=80`}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] group-hover:scale-[1.07] transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] mix-blend-multiply dark:mix-blend-normal"
                      />

                      {/* Sombra viñeta para darle profundidad 'cinemática' */}
                      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_120px_rgba(0,0,0,0.4)] pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-60"></div>

                      {/* Overlay sutil para oscurecer ligerísimamente en hover y mostrar contraste */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-[#00E5FF]/5 transition-colors duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)]"></div>

                      {product.discount > 0 && (
                        <span className="absolute top-10 left-10 px-6 py-3 bg-black/80 backdrop-blur-md text-white text-[11px] tracking-[0.2em] rounded-full drop-shadow-2xl">
                          -{product.discount}%
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Text Side */}
                  <div className="w-full md:w-[45%] flex flex-col justify-center">
                    <span className="text-[10px] tracking-[0.4em] font-medium text-gray-400 mb-6 uppercase block">
                      Edición Limitada {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-4xl lg:text-5xl font-light text-black dark:text-white tracking-tight leading-tight mb-8">
                      {product.name}
                    </h3>
                    <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
                      {product.description?.substring(0, 150) || 'Descubre el diseño sofisticado y las capacidades avanzadas de este dispositivo excepcional, creado minuciosamente para inspirar.'}...
                    </p>

                    <div className="flex items-end gap-4 mb-12">
                      <div className="text-3xl font-light tracking-tight text-black dark:text-white">
                        {formatPrice(discountedPrice(product.price, product.discount))}
                      </div>
                      {product.discount > 0 && (
                        <div className="text-sm font-light text-gray-400 line-through mb-1">
                          {formatPrice(product.price)}
                        </div>
                      )}
                    </div>

                    <div>
                      <Link
                        to={`/product/${product.id}`}
                        className="inline-flex items-center pb-3 border-b border-black/20 dark:border-white/20 text-[11px] tracking-[0.2em] font-medium text-black dark:text-white hover:border-black dark:hover:border-white transition-colors group"
                      >
                        VER DETALLES <ArrowRightIcon className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-48 text-center">
            <Link to="/shop" className="inline-block px-14 py-6 border border-black/10 dark:border-white/10 rounded-full text-[11px] tracking-[0.2em] uppercase font-medium text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500">
              Explorar Todo El Catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PREMIUM TESTIMONIALS (Social Proof) */}
      {!loadingDestacadas && destacadas.length > 0 && (
        <section className="py-32 bg-[#F5F5F7] dark:bg-[#050508] border-y border-gray-200/50 dark:border-white/5 transition-colors duration-500">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-20">
              <span className="text-[10px] tracking-[0.4em] font-medium text-[#00E5FF] uppercase block mb-4">
                Testimonios Reales
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-black dark:text-white tracking-tighter">
                Lo que dicen <span className="font-semibold italic">nuestros clientes.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destacadas.slice(0, 3).map((opinion) => (
                <div 
                  key={opinion.id} 
                  className="group relative bg-white dark:bg-[#0f0f14] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-[#00E5FF]/5 transition-all duration-500 flex flex-col h-full overflow-hidden"
                >
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00E5FF]/5 blur-[60px] rounded-full group-hover:bg-[#00E5FF]/10 transition-colors"></div>
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid 
                        key={i} 
                        className={`h-4 w-4 ${i < opinion.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-800'}`} 
                      />
                    ))}
                  </div>

                  <blockquote className="flex-grow">
                    <p className="text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300 italic mb-8">
                      "{opinion.mensaje}"
                    </p>
                  </blockquote>

                  <div className="flex items-center gap-4 pt-8 border-t border-gray-50 dark:border-white/5">
                    <div className="relative">
                      <img 
                        src={`${opinion.avatar}&w=100&h=100&auto=format&fit=crop`} 
                        alt={opinion.nombre} 
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded-full object-cover border border-black/5 dark:border-white/10" 
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-[#111]"></div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-black dark:text-white tracking-tight">
                        {opinion.nombre}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-gray-400 tracking-[0.1em] uppercase">
                          {opinion.producto}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                        <span className="text-[9px] text-gray-400 tracking-[0.1em]">
                          {new Date(opinion.fecha).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-10 right-10 opacity-[0.03] dark:opacity-[0.07] group-hover:opacity-[0.05] dark:group-hover:opacity-[0.1] transition-opacity duration-500">
                    <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. NEWSLETTER (Ultra minimal) */}
      <section className="py-40 bg-white dark:bg-[#0a0a0f] transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="text-4xl md:text-5xl font-light text-black dark:text-white tracking-tighter mb-6">
            <span className="font-semibold bg-gradient-to-r from-[#00E5FF] to-[#FF854D] bg-clip-text text-transparent">Únete a la Vanguardia.</span>
          </h2>
          <p className="text-gray-500 font-light mb-16 tracking-wide text-lg">
            Ingresa tu correo para recibir acceso anticipado a colaboraciones exclusivas y nuevos lanzamientos de diseño.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="relative group">
            <input
              type="email"
              placeholder="Tu dirección de correo"
              className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-4 px-2 text-center text-xl font-light text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="mt-12 px-12 py-5 uppercase tracking-[0.2em] text-[10px] font-medium bg-black text-white dark:bg-white dark:text-black rounded-full hover:scale-105 transition-transform disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'PROCESANDO...' : 'SUSCRÍBIRME'}
            </button>
          </form>
          {subscriptionMessage.text && (
            <p className={`mt-8 text-xs font-medium tracking-[0.1em] uppercase ${subscriptionMessage.type === 'error' ? 'text-[#FF854D]' : 'text-[#00E5FF]'}`}>
              {subscriptionMessage.text}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;