import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/auth/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const auth = useAuth();
  const navigate = useNavigate();
  const user = auth?.user;
  const profile = auth?.profile;
  const logout = auth?.logout ?? (() => { });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

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

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/shop' },
    { name: 'Servicios', path: '/services' },
    { name: 'Ofertas', path: '/ofertas', highlight: true },
    { name: 'Blog', path: '/blog' },
    { name: 'Contacto', path: '/contact' }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="absolute inset-0 bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 transition-colors duration-500"></div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 rounded-full bg-transparent">

          {/* Logo (Minimalist) */}
          <Link to="/" className="flex items-center space-x-3 group z-10">
            <div className="w-10 h-10 flex items-center justify-center bg-transparent rounded-full transition-transform duration-500 group-hover:scale-105 overflow-hidden">
              <img src="/logo.png" alt="Yersiman Logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-xl tracking-tighter text-gray-900 dark:text-white transition-colors duration-300">
                <span className="font-light">Yer</span>
                <span className="font-medium text-[#3F96FC]">siman</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex h-full items-center justify-center flex-1 mx-4">
            <div className="flex items-center space-x-1 xl:space-x-2 bg-white/50 dark:bg-black/20 backdrop-blur-md px-2 py-1.5 rounded-full border border-gray-200/50 dark:border-white/5">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  className="relative flex items-center"
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to={item.path}
                    className={`px-5 py-2 rounded-full text-[11px] font-medium tracking-[0.2em] transition-all duration-300 uppercase ${hoveredItem === item.path
                      ? 'bg-[#3F96FC] text-white shadow-lg shadow-[#3F96FC]/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-[#3F96FC] dark:hover:text-[#3F96FC]'
                      }`}
                  >
                    {item.name}
                    {item.highlight && (
                      <span className="absolute top-2.5 right-2 h-1.5 w-1.5 bg-[#FF854D] rounded-full animate-pulse"></span>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center space-x-3 z-10">

            {/* Search Button (Minimal) */}
            <div className="relative search-menu">
              <button
                onClick={toggleSearch}
                className={`p-2.5 rounded-full transition-all duration-300 ${searchOpen ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-500 dark:text-gray-400 hover:text-[#3F96FC] dark:hover:text-[#3F96FC] hover:bg-blue-50 dark:hover:bg-[#3F96FC]/10'}`}
              >
                <MagnifyingGlassIcon className={`h-5 w-5 ${searchOpen ? 'transform rotate-90 opacity-0 absolute' : 'transform rotate-0 opacity-100 transition-all duration-300'}`} />
                <XMarkIcon className={`h-5 w-5 ${searchOpen ? 'transform rotate-0 opacity-100 transition-all duration-300' : 'transform -rotate-90 opacity-0 absolute'}`} />
              </button>

              {/* Search Dropdown */}
              <div className={`absolute top-full right-0 mt-4 w-72 md:w-96 rounded-3xl bg-white/90 dark:bg-[#1f1f23]/90 backdrop-blur-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden transform transition-all duration-300 origin-top-right ${searchOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                <form onSubmit={handleSearch} className="relative p-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    autoFocus={searchOpen}
                    className="w-full bg-gray-50 dark:bg-[#111] border-none rounded-2xl text-sm font-light tracking-wide text-black dark:text-white px-5 py-4 focus:ring-2 focus:ring-[#3F96FC]/50 dark:focus:ring-[#3F96FC]/50 transition-all"
                  />
                  <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#3F96FC] transition-colors">
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-[#FF854D] dark:hover:text-[#FF854D] hover:bg-orange-50 dark:hover:bg-[#FF854D]/10 transition-all duration-300"
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            {/* Desktop User Menu (Minimalist) */}
            {user ? (
              <div className="relative profile-menu">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
                >
                  <img
                    src={profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                    alt={profile?.nombre}
                    className="w-8 h-8 rounded-full object-cover grayscale transition-transform duration-300 hover:grayscale-0"
                  />
                  <ChevronDownIcon className="w-3 h-3 text-gray-400" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-4 w-64 rounded-3xl bg-white/90 dark:bg-[#1f1f23]/90 backdrop-blur-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden transform transition-all duration-300 origin-top-right">
                    <div className="p-6 border-b border-gray-100 dark:border-white/5 text-center">
                      <img
                        src={profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                        alt={profile?.nombre}
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-3 grayscale"
                      />
                      <h4 className="text-sm font-medium text-black dark:text-white tracking-wide">
                        {profile ? `${profile.nombre} ${profile.apellido}` : 'Usuario'}
                      </h4>
                      <p className="text-[10px] tracking-[0.1em] text-gray-400 uppercase mt-1">
                        {profile?.email}
                      </p>
                    </div>

                    <div className="p-3">
                      {profile?.role === 'admin' ? (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center px-4 py-3 rounded-2xl text-[11px] font-medium tracking-[0.2em] text-gray-500 uppercase hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors"
                        >
                          <UserCircleIcon className="w-4 h-4 mr-3 opacity-50" />
                          Admin Panel
                        </Link>
                      ) : (
                        <Link
                          to="/profile"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center px-4 py-3 rounded-2xl text-[11px] font-medium tracking-[0.2em] text-gray-500 uppercase hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors"
                        >
                          <UserCircleIcon className="w-4 h-4 mr-3 opacity-50" />
                          Mi Cuenta
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 mt-1 rounded-2xl text-[11px] font-medium tracking-[0.2em] text-[#FF854D] uppercase hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-[11px] font-medium tracking-[0.2em] uppercase text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-medium tracking-[0.2em] uppercase hover:scale-105 transition-transform"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions & Menu Button */}
          <div className="xl:hidden flex items-center space-x-2 md:space-x-4 z-10">
            {/* Mobile Search Button & Input */}
            <div className="relative flex items-center">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Buscar"
              >
                <MagnifyingGlassIcon className={`h-6 w-6 transition-all duration-300 ${searchOpen ? 'transform rotate-90 opacity-0 absolute' : 'transform rotate-0 opacity-100'}`} />
                <XMarkIcon className={`h-6 w-6 transition-all duration-300 ${searchOpen ? 'transform rotate-0 opacity-100' : 'transform -rotate-90 opacity-0 absolute'}`} />
              </button>

              {/* Mobile Search Input Overlay */}
              <div className={`absolute top-full right-0 mt-4 w-[calc(100vw-2rem)] sm:w-80 rounded-2xl bg-white/90 dark:bg-[#1f1f23]/90 backdrop-blur-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden transform transition-all duration-300 origin-top-right z-50 ${searchOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                <form onSubmit={handleSearch} className="relative p-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    autoFocus={searchOpen}
                    className="w-full bg-gray-50 dark:bg-[#111] border-none rounded-xl text-sm font-light tracking-wide text-black dark:text-white px-4 py-3 focus:ring-2 focus:ring-[#3F96FC]/50 transition-all"
                  />
                  <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#3F96FC] transition-colors">
                    <MagnifyingGlassIcon className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              {isOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <div
        className={`xl:hidden fixed inset-0 top-[4rem] z-40 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-2xl transition-all duration-500 origin-top transform ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-col p-8 h-full overflow-y-auto">

          <div className="flex flex-col space-y-4 mt-4 text-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={toggleMenu}
                className={`text-lg md:text-xl font-light tracking-widest uppercase transition-colors ${item.highlight ? 'text-[#FF854D] font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-[#3F96FC] dark:hover:text-[#3F96FC]'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-12 pt-8 pb-8">
            <div className="h-px w-full bg-gray-200 dark:bg-gray-800 mb-8"></div>

            {user ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                    alt="Perfil"
                    className="w-12 h-12 rounded-full object-cover grayscale"
                  />
                  <div>
                    <span className="block font-medium text-black dark:text-white tracking-wide">
                      {profile ? `${profile.nombre} ${profile.apellido}` : 'Usuario'}
                    </span>
                    <span className="text-[10px] tracking-[0.2em] font-light text-gray-500 uppercase">
                      {profile?.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </div>
                </div>

                {profile?.role === 'admin' ? (
                  <Link to="/admin/dashboard" onClick={toggleMenu} className="text-sm font-light tracking-widest text-[#3F96FC] uppercase">Panel Admin</Link>
                ) : (
                  <Link to="/profile" onClick={toggleMenu} className="text-sm font-light tracking-widest text-black dark:text-white uppercase">Mi Perfil</Link>
                )}
                <button onClick={() => { logout(); toggleMenu(); }} className="text-left text-sm font-light tracking-widest text-[#FF854D] uppercase">Cerrar Sesión</button>
              </div>
            ) : (
              <div className="flex flex-col space-y-6">
                <Link to="/login" onClick={toggleMenu} className="text-sm font-light tracking-widest text-black dark:text-white uppercase">Ingresar a mi cuenta</Link>
                <Link to="/register" onClick={toggleMenu} className="inline-block py-4 rounded-full bg-black text-white dark:bg-white dark:text-black text-center text-xs font-medium tracking-[0.2em] uppercase">Crear Nueva Cuenta</Link>
              </div>
            )}
          </div>
        </div>
      </div>

    </header>
  );
};

export default Navbar;
