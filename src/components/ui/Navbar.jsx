import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth(); // Get user and logout function from AuthContext

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close profile menu when clicking outside
    const handleClickOutside = (event) => {
      if (profileMenuOpen && !event.target.closest('.profile-menu')) {
        setProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);
  const toggleExpandedItem = (path) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      setProfileMenuOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navItems = [
    { name: 'Inicio', path: '/' },
    { 
      name: 'Productos', 
      path: '/shop',
      subItems: [
        'Computadoras',
        'Componentes',
        'Periféricos',
        'Almacenamiento',
        'Monitores',
        'Impresoras',
        'Seguridad',
        'Accesorios',
        'Varios'
      ]
    },
    { 
      name: 'Servicios', 
      path: '/services',
      subItems: [
        'Servicio Técnico',
        'Mantenimiento',
        'Instalación',
        'Soporte'
      ]
    },
    { name: 'Ofertas', path: '/ofertas', highlight: true },
    { name: 'Blog', path: '/blog' },
    { name: 'Contacto', path: '/contact' }
  ];

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.user_metadata?.full_name) return 'U';
    const nameParts = user.user_metadata.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      
      <div className="w-full">
        <div className="flex justify-between items-center h-20 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center">
              <img src="/logo3.jpg" alt="JerzyStore Logo" className="w-[300%] h-[300%] object-contain" />
            </div>
            <div className="hidden lg:flex flex-col">
              <span className={`text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-300`}>
                <span className="font-light">Yer</span>
                <span className="font-bold">siman</span>
              </span>
              <span className="text-xs font-bold">
                <span className="text-orange-500">S</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>olutions</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex h-full items-center justify-between flex-1 ml-10">
            <div className="flex items-center justify-center flex-1 space-x-1">
              {navItems.map((item) => (
                <div 
                  key={item.path}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-all duration-300 ${darkMode ? 'hover:bg-gray-800/80 hover:shadow-md hover:scale-105 hover:text-white' : 'hover:bg-white/80 hover:shadow-md hover:scale-105'} ${hoveredItem === item.path ? (darkMode ? 'text-white font-medium' : 'text-indigo-600 font-medium') : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-indigo-500')}`}
                  >
                    <span className="relative font-medium">
                      {item.name}
                      {item.highlight && (
                        <span className="absolute -top-1 -right-3 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </span>
                    {item.subItems && <ChevronDownIcon className="w-4 h-4" />}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.subItems && hoveredItem === item.path && (
                    <div className={`absolute top-full left-0 w-48 py-2 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border animate-fadeIn`}>
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem}
                          to={`${item.path}/${subItem.toLowerCase()}`}
                          className={`block px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-indigo-50 text-gray-700'} transition-colors`}
                        >
                          {subItem}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="flex items-center space-x-4">
              {/* Desktop Search Bar */}
              <div className="hidden lg:block relative group">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className={`w-64 py-2.5 pl-4 pr-10 rounded-full text-sm transition-all duration-300 ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 focus:border-indigo-500' : 'bg-white/50 border-gray-200 text-gray-800 placeholder-gray-500 focus:bg-white focus:border-indigo-500'} border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-transparent group-hover:border-indigo-300`}
                />
                <div className={`absolute right-3 top-2.5 p-1.5 rounded-full transition-all duration-300 ${darkMode ? 'bg-indigo-500/30 group-hover:bg-indigo-400/50 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-indigo-100 group-hover:bg-indigo-200 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.3)]'}`}>
                  <MagnifyingGlassIcon className={`h-4 w-4 transition-colors duration-300 ${darkMode ? 'text-indigo-200 group-hover:text-indigo-100' : 'text-indigo-600 group-hover:text-indigo-700'}`} />
                </div>
              </div>

              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'hover:bg-gray-800/80 hover:shadow-md hover:scale-110 text-yellow-300 hover:text-yellow-200' : 'hover:bg-white/80 hover:shadow-md hover:scale-110 text-gray-600 hover:text-amber-500'}`}
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {/* Show either login/register or user profile based on auth state */}
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${darkMode ? 'hover:bg-gray-800/80 hover:shadow-md hover:scale-105 text-gray-300 hover:text-white' : 'hover:bg-white/80 hover:shadow-md hover:scale-105 text-gray-700 hover:text-indigo-500'} flex items-center space-x-2`}
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    <span className="font-medium">Ingresar</span>
                  </Link>
                  
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <div className="relative profile-menu">
                  <button
                    onClick={toggleProfileMenu}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${darkMode ? 'hover:bg-gray-800/80 text-white' : 'hover:bg-white/80 text-gray-800'} ${profileMenuOpen ? (darkMode ? 'bg-gray-800' : 'bg-white') : ''}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-medium ${darkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} text-white`}>
                      {getUserInitials()}
                    </div>
                    <span className="font-medium hidden md:block">{getUserDisplayName()}</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${profileMenuOpen ? 'transform rotate-180' : ''}`} />
                  </button>

                  {/* User dropdown menu */}
                  {profileMenuOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg overflow-hidden z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border animate-fadeIn`}>
                      <div className={`px-4 py-3 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Conectado como</p>
                        <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className={`px-4 py-2 text-sm flex items-center space-x-2 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                        >
                          <UserCircleIcon className="h-5 w-5" />
                          <span>Mi perfil</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          <span>Cerrar sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800 text-yellow-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            
            <button 
              onClick={toggleMenu}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-800'} transition-colors`}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="lg:hidden py-3 px-4 animate-slideDown">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className={`w-full py-2.5 pl-10 pr-4 rounded-full text-sm transition-all duration-300 ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 focus:border-indigo-500' : 'bg-white/50 border-gray-200 text-gray-800 placeholder-gray-500 focus:bg-white focus:border-indigo-500'} border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-transparent`}
              />
              <div className={`absolute left-3 top-2.5 p-1.5 rounded-full transition-all duration-300 ${darkMode ? 'bg-indigo-500/30 group-hover:bg-indigo-400/50 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-indigo-100 group-hover:bg-indigo-200 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.3)]'}`}>
                <MagnifyingGlassIcon className={`h-4 w-4 ${darkMode ? 'text-indigo-200' : 'text-indigo-600'}`} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className={`lg:hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl animate-slideDown max-h-[calc(100vh-5rem)] overflow-y-auto`}>
          <div className="px-4 py-3">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <div key={item.path}>
                  <div
                    className={`flex items-center justify-between px-4 py-3 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors cursor-pointer`}
                    onClick={() => item.subItems ? toggleExpandedItem(item.path) : null}
                  >
                    <Link
                      to={item.path}
                      onClick={(e) => {
                        if (!item.subItems) {
                          toggleMenu();
                        } else {
                          e.preventDefault();
                        }
                      }}
                      className="flex items-center font-medium"
                    >
                      {item.name}
                      {item.highlight && (
                        <span className="ml-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </Link>
                    {item.subItems && (
                      <ChevronDownIcon 
                        className={`w-4 h-4 transition-transform duration-200 ${expandedItems.includes(item.path) ? 'transform rotate-180' : ''}`} 
                      />
                    )}
                  </div>
                  
                  {item.subItems && expandedItems.includes(item.path) && (
                    <div className="ml-4 mt-1 mb-2 flex flex-col space-y-1 animate-slideDown">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem}
                          to={`${item.path}/${subItem.toLowerCase()}`}
                          onClick={toggleMenu}
                          className={`px-4 py-2 text-sm rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                        >
                          {subItem}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-3">
                {/* Mobile auth menu: Show different options based on auth state */}
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                    >
                      <UserCircleIcon className="h-5 w-5" />
                      <span className="font-medium">Ingresar</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={toggleMenu}
                      className="block px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white mt-2 hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all text-center font-medium"
                    >
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <>
                    <div className={`flex items-center space-x-3 px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${darkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} text-white`}>
                        {getUserInitials()}
                      </div>
                      <div>
                        <p className="font-medium">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={toggleMenu}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg mt-2 ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                    >
                      <UserCircleIcon className="h-5 w-5" />
                      <span>Mi perfil</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg mt-2 ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Cerrar sesión</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;