import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import DarkModeWrapper from '@/components/ui/DarkModeWrapper';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0);

  const slides = [
    {
      title: "Tecnología de Vanguardia",
      subtitle: "Descubre lo último en innovación tecnológica",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3",
      bgColor: "bg-gradient-to-r from-indigo-900 to-purple-800"
    },
    {
      title: "Diseño Excepcional",
      subtitle: "Productos diseñados para inspirar",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3",
      bgColor: "bg-gradient-to-r from-gray-900 to-blue-900"
    },
    {
      title: "Rendimiento Superior",
      subtitle: "Experimenta potencia sin límites",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d3?ixlib=rb-4.0.3",
      bgColor: "bg-gradient-to-r from-blue-900 to-indigo-800"
    }
  ];

  const categories = [
    {
      name: "Laptops",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3"
    },
    {
      name: "Workstations",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3"
    },
    {
      name: "Componentes",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d3?ixlib=rb-4.0.3"
    },
    {
      name: "Accesorios",
      image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-4.0.3"
    },
    {
      name: "Monitores",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3"
    },
    {
      name: "Periféricos",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3"
    },
    {
      name: "Almacenamiento",
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3"
    },
    {
      name: "Redes",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextCategorySlide = () => {
    setCurrentCategorySlide((prev) => {
      const maxSlides = Math.ceil(categories.length / 4) - 1;
      return prev === maxSlides ? 0 : prev + 1;
    });
  };

  const prevCategorySlide = () => {
    setCurrentCategorySlide((prev) => {
      const maxSlides = Math.ceil(categories.length / 4) - 1;
      return prev === 0 ? maxSlides : prev - 1;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Efecto para el carrusel automático de categorías
  useEffect(() => {
    if (categories.length <= 4) return;
    
    const interval = setInterval(() => {
      nextCategorySlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [categories.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden bg-white dark:bg-gray-900">
        <div className="relative h-screen max-h-[800px] overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div 
                key={index}
                className={`w-full flex-shrink-0 h-screen max-h-[800px] relative ${slide.bgColor}`}
              >
                {/* Imagen de fondo que ocupa todo el espacio */}
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
                </div>
                
                {/* Contenido superpuesto */}
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between h-full relative z-10">
                  <div className="md:w-1/2 lg:w-2/5 text-white space-y-6 px-4 md:px-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200">
                      {slide.subtitle}
                    </p>
                    <button className="px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
                      Explorar Productos
                    </button>
                  </div>
                  <div className="hidden md:block md:w-1/2 lg:w-3/5 h-full relative">
                    {/* Espacio reservado para mantener el layout */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controles del carrusel */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-8 rounded-full transition-all ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-700"
              >
                <div className="relative group overflow-hidden rounded-xl h-80">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    <button className="mt-2 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Ver productos →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Productos Destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              {
                name: "Laptop Pro X1",
                price: 1299.99,
                discount: 15,
                rating: 4.8,
                reviews: 124,
                image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3",
                isNew: true,
                stock: 8
              },
              {
                name: "Monitor Ultra HD",
                price: 499.99,
                discount: 0,
                rating: 4.9,
                reviews: 87,
                image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3",
                isNew: false,
                stock: 15
              },
              {
                name: "Teclado Mecánico RGB",
                price: 129.99,
                discount: 20,
                rating: 4.7,
                reviews: 56,
                image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3",
                isNew: false,
                stock: 3
              },
              {
                name: "SSD 1TB NVMe",
                price: 199.99,
                discount: 10,
                rating: 4.9,
                reviews: 42,
                image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3",
                isNew: true,
                stock: 12
              }
            ].map((product, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600"
              >
                <div className="relative h-56 overflow-hidden group">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Nuevo
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  
                  {/* Stock indicator */}
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      ¡Últimas {product.stock} unidades!
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="absolute top-3 right-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Agotado
                    </span>
                  )}
                  
                  {/* Quick action button */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-100 transition-colors">
                      Ver detalles
                    </button>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{product.name}</h3>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      {product.discount > 0 ? (
                        <div className="flex items-center">
                          <span className="font-bold text-xl text-gray-900 dark:text-white">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">${product.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-xl text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
              Ver todos los productos
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mantente Informado</h2>
                <p className="text-indigo-100 text-lg mb-6">
                  Suscríbete a nuestro boletín para recibir las últimas novedades, ofertas exclusivas y consejos tecnológicos.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Tu correo electrónico" 
                    className="flex-grow px-5 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                  <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5">
                    Suscribirse
                  </button>
                </div>
                <p className="text-indigo-200 text-sm mt-4">
                  Respetamos tu privacidad. Puedes darte de baja en cualquier momento.
                </p>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-8 md:p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Beneficios exclusivos</h3>
                  <ul className="text-indigo-100 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Ofertas especiales
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Lanzamientos anticipados
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Consejos tecnológicos
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Lo que dicen nuestros clientes</h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Experiencias reales de usuarios satisfechos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Carlos Rodríguez",
                role: "Diseñador Gráfico",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
                rating: 5,
                text: "La calidad de los productos es excepcional. El servicio al cliente fue rápido y eficiente. Definitivamente volveré a comprar aquí."
              },
              {
                name: "Laura Martínez",
                role: "Desarrolladora Web",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3",
                rating: 5,
                text: "Encontré exactamente lo que necesitaba para mi trabajo. La entrega fue rápida y el producto superó mis expectativas. ¡Altamente recomendado!"
              },
              {
                name: "Miguel Sánchez",
                role: "Estudiante de Ingeniería",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3",
                rating: 4,
                text: "Buena relación calidad-precio. Los productos son de alta calidad y el sitio web es fácil de usar. La única sugerencia sería mejorar los tiempos de envío."
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600"
              >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full"></div>
                
                <div className="p-8 relative z-10">
                  {/* Quote icon */}
                  <div className="text-indigo-500/30 mb-4">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  {/* Testimonial text */}
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Author info */}
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-indigo-100">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-indigo-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to action */}
          <div className="text-center mt-12">
            <Link 
              to="/opiniones"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Ver más testimonios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;