import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cog6ToothIcon,
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { blogService } from '../../services/blogService';
import { opinionService } from '../../services/opinionService';
import { contactService } from '../../services/contactService';
import { legalService } from '../../services/legalService';
import { newsletterService } from '../../services/newsletterService';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatPrice } from '../../utils/formatPrice';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 'S/ 0',
    activeProducts: 0,
    pendingPosts: 0,
    pendingReviews: 0,
    unreadMessages: 0,
    legalDocuments: 0,
    newsletterSubscribers: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Cargar los posts pendientes
      const { success: postsSuccess, data: postsData } = await blogService.getAdminPosts({ status: 'pending' });
      
      // Cargar estadísticas de opiniones
      const { success: opinionSuccess, data: opinionStats } = await opinionService.getStats();
      
      // Cargar mensajes no leídos
      const { success: messagesSuccess, data: messagesData } = await contactService.getMessages('unread');
      
      // Cargar documentos legales
      const { success: legalSuccess, data: legalData } = await legalService.getAllLegalDocuments();

      // Cargar suscriptores del newsletter
      const { success: newsletterSuccess, data: newsletterData } = await newsletterService.getSubscribers();

      setStats(prev => ({
        ...prev,
        pendingPosts: postsSuccess ? postsData.length : 0,
        pendingReviews: opinionSuccess ? (opinionStats?.pending_reviews || 0) : 0,
        totalUsers: opinionSuccess ? (opinionStats?.total_users || 0) : 0,
        totalOrders: opinionSuccess ? (opinionStats?.total_orders || 0) : 0,
        totalRevenue: opinionSuccess ? (opinionStats?.total_revenue ? formatPrice(opinionStats.total_revenue) : formatPrice(0)) : formatPrice(0),
        activeProducts: opinionSuccess ? (opinionStats?.active_products || 0) : 0,
        unreadMessages: messagesSuccess ? messagesData.length : 0,
        legalDocuments: legalSuccess ? legalData.length : 0,
        newsletterSubscribers: newsletterSuccess ? newsletterData.length : 0
      }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" color="gradient" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Panel de <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Administración</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Gestión centralizada de tu plataforma
            </p>
          </div>
          
          <button 
            onClick={loadDashboardData}
            className="flex items-center px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Actualizar datos
          </button>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard 
            icon={<UsersIcon className="w-6 h-6" />}
            title="Usuarios"
            value={stats.totalUsers}
            color="indigo"
            link="/admin/users"
          />
          <StatCard 
            icon={<ShoppingBagIcon className="w-6 h-6" />}
            title="Pedidos"
            value={stats.totalOrders}
            color="blue"
            link="/admin/estadisticas"
          />
          <StatCard 
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            title="Ingresos"
            value={stats.totalRevenue}
            color="green"
            link="/admin/estadisticas"
          />
          <StatCard 
            icon={<DocumentTextIcon className="w-6 h-6" />}
            title="Documentos"
            value={stats.legalDocuments}
            color="purple"
            link="/admin/legal"
          />
        </div>

        {/* Módulos de administración */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <DashboardCard 
            icon={<CubeIcon className="w-6 h-6" />}
            title="Productos"
            description="Gestionar catálogo de productos"
            color="blue"
            link="/admin/products"
          />
          
          <DashboardCard 
            icon={<ShoppingBagIcon className="w-6 h-6" />}
            title="Productos Avanzado"
            description="Sistema completo de e-commerce"
            color="green"
            link="/admin/products-advanced"
          />
          
          <DashboardCard 
            icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />}
            title="Blog"
            description={`Gestionar posts ${stats.pendingPosts > 0 ? `(${stats.pendingPosts} pendientes)` : ''}`}
            color="purple"
            link="/admin/blog"
            badge={stats.pendingPosts}
          />
          
          <DashboardCard 
            icon={<StarIcon className="w-6 h-6" />}
            title="Opiniones"
            description={`Gestionar valoraciones ${stats.pendingReviews > 0 ? `(${stats.pendingReviews} nuevas)` : ''}`}
            color="yellow"
            link="/admin/opiniones"
            badge={stats.pendingReviews}
          />
          
          <DashboardCard 
            icon={<EnvelopeIcon className="w-6 h-6" />}
            title="Mensajes"
            description={`Consultas de clientes ${stats.unreadMessages > 0 ? `(${stats.unreadMessages} sin leer)` : ''}`}
            color="blue"
            link="/admin/contactos"
            badge={stats.unreadMessages}
          />
          
          <DashboardCard 
            icon={<InformationCircleIcon className="w-6 h-6" />}
            title="About"
            description="Gestionar contenido de la página"
            color="green"
            link="/admin/about"
          />
          
          <DashboardCard 
            icon={<DocumentTextIcon className="w-6 h-6" />}
            title="Términos"
            description="Editar términos y condiciones"
            color="indigo"
            link="/admin/legal/terms"
          />
          
          <DashboardCard 
            icon={<ShieldCheckIcon className="w-6 h-6" />}
            title="Privacidad"
            description="Editar política de privacidad"
            color="pink"
            link="/admin/legal/privacy"
          />
          
          <DashboardCard 
            icon={<UsersIcon className="w-6 h-6" />}
            title="Usuarios"
            description="Gestionar usuarios y roles"
            color="indigo"
            link="/admin/users"
          />
          
          <DashboardCard 
            icon={<Cog6ToothIcon className="w-6 h-6" />}
            title="Configuración"
            description="Ajustes generales del sistema"
            color="gray"
            link="/admin/configuracion"
          />
          
          <DashboardCard 
            icon={<EnvelopeIcon className="w-6 h-6" />}
            title="Newsletter"
            description={`Suscriptores registrados (${stats.newsletterSubscribers})`}
            color="indigo"
            link="/admin/newsletter"
          />
          
          <DashboardCard 
            icon={<ChartBarIcon className="w-6 h-6" />}
            title="Estadísticas"
            description="Reportes y análisis de datos"
            color="teal"
            link="/admin/estadisticas"
          />

          <DashboardCard 
            icon={<WrenchScrewdriverIcon className="w-6 h-6" />}
            title="Servicios"
            description="Gestionar servicios técnicos"
            color="indigo"
            link="/admin/servicios"
          />

          <DashboardCard 
            icon={<SparklesIcon className="w-6 h-6" />}
            title="Inicio"
            description="Personalizar Hero principal"
            color="purple"
            link="/admin/home"
          />
        </div>
      </div>
    </div>
  );
}

// Componente para las tarjetas de estadísticas
function StatCard({ icon, title, value, color, link }) {
  const colorVariants = {
    indigo: 'from-indigo-500 to-indigo-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    pink: 'from-pink-500 to-pink-600',
    teal: 'from-teal-500 to-teal-600',
    gray: 'from-gray-500 to-gray-600'
  };

  return (
    <Link to={link} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-transparent">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorVariants[color]} text-white`}>
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            Ver detalles
          </span>
          <div className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Componente para los módulos de administración
function DashboardCard({ icon, title, description, color, link, badge }) {
  const colorVariants = {
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/50',
      icon: 'text-indigo-600 dark:text-indigo-400',
      hover: 'hover:bg-indigo-200 dark:hover:bg-indigo-800/50',
      text: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/50',
      icon: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:bg-blue-200 dark:hover:bg-blue-800/50',
      text: 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/50',
      icon: 'text-green-600 dark:text-green-400',
      hover: 'hover:bg-green-200 dark:hover:bg-green-800/50',
      text: 'group-hover:text-green-600 dark:group-hover:text-green-400'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/50',
      icon: 'text-purple-600 dark:text-purple-400',
      hover: 'hover:bg-purple-200 dark:hover:bg-purple-800/50',
      text: 'group-hover:text-purple-600 dark:group-hover:text-purple-400'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/50',
      icon: 'text-yellow-600 dark:text-yellow-400',
      hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-800/50',
      text: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400'
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-900/50',
      icon: 'text-pink-600 dark:text-pink-400',
      hover: 'hover:bg-pink-200 dark:hover:bg-pink-800/50',
      text: 'group-hover:text-pink-600 dark:group-hover:text-pink-400'
    },
    teal: {
      bg: 'bg-teal-100 dark:bg-teal-900/50',
      icon: 'text-teal-600 dark:text-teal-400',
      hover: 'hover:bg-teal-200 dark:hover:bg-teal-800/50',
      text: 'group-hover:text-teal-600 dark:group-hover:text-teal-400'
    },
    gray: {
      bg: 'bg-gray-100 dark:bg-gray-900/50',
      icon: 'text-gray-600 dark:text-gray-400',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-800/50',
      text: 'group-hover:text-gray-600 dark:group-hover:text-gray-400'
    }
  };

  return (
    <Link 
      to={link} 
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-transparent relative overflow-hidden`}
    >
      {badge > 0 && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${colorVariants[color].bg} ${colorVariants[color].hover} transition-colors duration-300`}>
          <div className={colorVariants[color].icon}>
            {icon}
          </div>
        </div>
        <div className="ml-4">
          <h3 className={`text-lg font-medium text-gray-900 dark:text-white ${colorVariants[color].text} transition-colors duration-300`}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <div className="w-6 h-6 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}