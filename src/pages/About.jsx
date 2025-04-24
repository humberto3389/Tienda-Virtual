import { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSiteSettings();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  const team = [
    {
      name: 'Juan Pérez',
      role: 'Fundador & CEO',
      bio: 'Con más de 15 años de experiencia en tecnología y servicios técnicos.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'María García',
      role: 'Directora Técnica',
      bio: 'Especialista en sistemas y redes con certificaciones internacionales.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Carlos López',
      role: 'Supervisor de Servicios',
      bio: 'Experto en mantenimiento y reparación de equipos.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  const values = [
    {
      icon: UserGroupIcon,
      title: 'Nuestro Equipo',
      description: 'Un grupo diverso de profesionales apasionados por brindar el mejor servicio.'
    },
    {
      icon: TrophyIcon,
      title: 'Excelencia',
      description: 'Nos esforzamos por mantener los más altos estándares en todo lo que hacemos.'
    },
    {
      icon: HeartIcon,
      title: 'Compromiso',
      description: 'Dedicados a satisfacer las necesidades de nuestros clientes.'
    },
    {
      icon: SparklesIcon,
      title: 'Innovación',
      description: 'Constantemente buscamos nuevas formas de mejorar y crecer.'
    }
  ];

  const stats = [
    { name: 'Años de experiencia', value: '10+' },
    { name: 'Clientes satisfechos', value: '1000+' },
    { name: 'Servicios completados', value: '5000+' },
    { name: 'Técnicos certificados', value: '15+' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Acerca de JerzyStore
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos una tienda comprometida con la calidad y la satisfacción del cliente.
            Nuestra misión es proporcionar productos excepcionales y un servicio impecable.
          </p>
        </div>

        {/* Valores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <value.icon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Historia */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              JerzyStore nació de la visión de crear una tienda que combine la conveniencia
              del comercio electrónico con la calidad y el servicio personalizado de una
              tienda tradicional.
            </p>
            <p className="text-gray-600 mb-4">
              Desde nuestros inicios, nos hemos enfocado en seleccionar cuidadosamente
              cada producto que ofrecemos, asegurándonos de que cumpla con nuestros
              altos estándares de calidad.
            </p>
            <p className="text-gray-600">
              Hoy, seguimos creciendo y evolucionando, siempre manteniendo nuestro
              compromiso con la excelencia y la satisfacción del cliente.
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
            <div className="text-gray-600">Clientes Satisfechos</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
            <div className="text-gray-600">Productos</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
            <div className="text-gray-600">Marcas Colaboradoras</div>
          </div>
        </div>

        {/* Equipo */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:py-24">
            <div className="space-y-12">
              <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Nuestro equipo</h2>
                <p className="text-xl text-gray-500">
                  Conoce a las personas detrás de nuestro éxito.
                </p>
              </div>
              <ul className="mx-auto space-y-16 sm:grid sm:grid-cols-2 sm:gap-16 sm:space-y-0 lg:max-w-5xl lg:grid-cols-3">
                {team.map((person) => (
                  <li key={person.name}>
                    <div className="space-y-6">
                      <img className="mx-auto h-40 w-40 rounded-full xl:w-56 xl:h-56" src={person.image} alt="" />
                      <div className="space-y-2">
                        <div className="text-lg leading-6 font-medium space-y-1">
                          <h3>{person.name}</h3>
                          <p className="text-blue-600">{person.role}</p>
                        </div>
                        <ul className="flex justify-center space-x-5">
                          <li>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                              <span className="sr-only">Twitter</span>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                              </svg>
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                              <span className="sr-only">LinkedIn</span>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                              </svg>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">¿Listo para comenzar?</span>
              <span className="block text-blue-600">Únete a nuestra comunidad de clientes satisfechos.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Contáctanos
                </a>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  Más información
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 