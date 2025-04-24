import { Routes, Route } from 'react-router-dom'
import Navbar from './components/ui/Navbar'
import Footer from './components/ui/Footer'
import PageLayout from './components/ui/PageLayout'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Services from './pages/Services'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import PrivateRoute from './components/PrivateRoute'
import AdminDashboard from './pages/Admin/Dashboard'
import About from './pages/About'
import BlogDetail from './pages/BlogDetail'
import Servicios from './pages/Servicios'
import ServicioDetalle from './pages/ServicioDetalle'
import Ofertas from './pages/Ofertas'
import Opiniones from './pages/Opiniones'
import AuthRedirect from './pages/Auth/AuthRedirect'
import AuthCallback from './pages/Auth/AuthCallback'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PageLayout><Home /></PageLayout>} />
          <Route path="/shop" element={<PageLayout><Shop /></PageLayout>} />
          <Route path="/services" element={<PageLayout><Services /></PageLayout>} />
          <Route path="/blog" element={<PageLayout><Blog /></PageLayout>} />
          <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
          <Route path="/login" element={<PageLayout><Login /></PageLayout>} />
          <Route path="/register" element={<PageLayout><Register /></PageLayout>} />
          <Route path="/about" element={<PageLayout><About /></PageLayout>} />
          <Route path="/blog/:id" element={<PageLayout><BlogDetail /></PageLayout>} />
          <Route path="/servicios" element={<PageLayout><Servicios /></PageLayout>} />
          <Route path="/servicios/:id" element={<PageLayout><ServicioDetalle /></PageLayout>} />
          <Route path="/ofertas" element={<PageLayout><Ofertas /></PageLayout>} />
          <Route path="/opiniones" element={<PageLayout><Opiniones /></PageLayout>} />
          
          {/* Auth Routes */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/redirect" element={<AuthRedirect />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={
            <PrivateRoute>
              <PageLayout><Profile /></PageLayout>
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<PageLayout><NotFound /></PageLayout>} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App