import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, TagIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de ofertas
    const fetchOfertas = () => {
      // Datos de ejemplo para ofertas
      const ofertasEjemplo = [
        {
          id: 1,
          nombre: "Laptop HP Pavilion",
          precio: 899.99,
          precioAnterior: 1299.99,
          descuento: 30,
          imagen: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          rating: 4.5,
          stock: 5,
          destacado: true
        },
        {
          id: 2,
          nombre: "Monitor Dell 27\"",
          precio: 249.99,
          precioAnterior: 349.99,
          descuento: 28,
          imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          rating: 4.2,
          stock: 8,
          destacado: false
        },
        {
          id: 3,
          nombre: "Teclado Mecánico RGB",
          precio: 79.99,
          precioAnterior: 119.99,
          descuento: 33,
          imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80",
          rating: 4.7,
          stock: 12,
          destacado: true
        },
        {
          id: 4,
          nombre: "Mouse Gaming Inalámbrico",
          precio: 49.99,
          precioAnterior: 79.99,
          descuento: 37,
          imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80",
          rating: 4.3,
          stock: 15,
          destacado: false
        },
        {
          id: 5,
          nombre: "Auriculares Bluetooth",
          precio: 89.99,
          precioAnterior: 149.99,
          descuento: 40,
          imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          rating: 4.6,
          stock: 7,
          destacado: true
        },
        {
          id: 6,
          nombre: "Disco SSD 1TB",
          precio: 129.99,
          precioAnterior: 199.99,
          descuento: 35,
          imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          rating: 4.8,
          stock: 10,
          destacado: false
        }
      ];

      setTimeout(() => {
        setOfertas(ofertasEjemplo);
        setLoading(false);
      }, 800);
    };

    fetchOfertas();
  }, []);

  // Función para renderizar estrellas
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarOutlineIcon className="h-5 w-5 text-yellow-400" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <StarIcon className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<StarOutlineIcon key={i} className="h-5 w-5 text-yellow-400" />);
      }
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            <span className="block">Ofertas Especiales</span>
            <span className="block text-indigo-600 mt-2">Ahorra en tus compras</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Descubre nuestros productos con los mejores descuentos del momento
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {ofertas.map((oferta) => (
            <div key={oferta.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Badge de descuento */}
              <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg font-bold z-10">
                -{oferta.descuento}%
              </div>
              
              {/* Badge de destacado */}
              {oferta.destacado && (
                <div className="absolute top-0 left-0 bg-indigo-500 text-white px-3 py-1 rounded-br-lg font-bold z-10">
                  Destacado
                </div>
              )}
              
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                <img
                  src={oferta.imagen}
                  alt={oferta.nombre}
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="mt-4 px-4 pb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <Link to={`/product/${oferta.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {oferta.nombre}
                  </Link>
                </h3>
                <div className="mt-1 flex items-center">
                  <div className="flex items-center">
                    {renderStars(oferta.rating)}
                  </div>
                  <p className="ml-2 text-sm text-gray-500">({Math.floor(Math.random() * 100) + 10} reseñas)</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 line-through">${oferta.precioAnterior.toFixed(2)}</p>
                    <p className="text-xl font-bold text-indigo-600">${oferta.precio.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-500">
                      {oferta.stock > 10 ? 'En stock' : `Solo ${oferta.stock} disponibles`}
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
      </div>
    </div>
  );
};

export default Ofertas; 