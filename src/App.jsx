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
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import PrivateRoute from './components/auth/PrivateRoute'
import AdminRoute from './components/auth/AdminRoute'
import AdminDashboard from './pages/Admin/Dashboard'
import About from './pages/About'
import BlogDetail from './pages/BlogDetail'
import ServicioDetalle from './pages/ServicioDetalle'
import Ofertas from './pages/Ofertas'
import Opiniones from './pages/Opiniones'
import BlogPosts from './pages/Admin/BlogPosts'
import AdminOpinion from './pages/Admin/AdminOpinion'  // Keep this exact casing
import ContactAdmin from './pages/Admin/ContactAdmin'
import TermsEditor from './pages/Admin/Legal/TermsEditor'
import PrivacyEditor from './pages/Admin/Legal/PrivacyEditor'
import AboutEditor from './pages/Admin/AboutEditor'
import UserAdmin from './pages/Admin/UserAdmin'
import NewsletterSubscribers from './pages/Admin/NewsletterSubscribers'
import Products from './pages/Admin/Products'
import ProductsAdvanced from './pages/Admin/ProductsAdvanced'
import ProductDetail from './pages/ProductDetail'
import ServicesAdmin from './pages/Admin/ServicesAdmin'
import HomeAdmin from './pages/Admin/HomeAdmin'

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
          <Route path="/servicios" element={<PageLayout><Services /></PageLayout>} />
          <Route path="/blog" element={<PageLayout><Blog /></PageLayout>} />
          <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
          <Route path="/login" element={<PageLayout><Login /></PageLayout>} />
          <Route path="/register" element={<PageLayout><Register /></PageLayout>} />
          <Route path="/forgot-password" element={<PageLayout><ForgotPassword /></PageLayout>} />
          <Route path="/reset-password" element={<PageLayout><ResetPassword /></PageLayout>} />
          <Route path="/verify-email" element={<PageLayout><VerifyEmail /></PageLayout>} />
          <Route path="/about" element={<PageLayout><About /></PageLayout>} />
          <Route path="/blog/:id" element={<PageLayout><BlogDetail /></PageLayout>} />
          <Route path="/product/:id" element={<PageLayout><ProductDetail /></PageLayout>} />
          <Route path="/servicios/:id" element={<PageLayout><ServicioDetalle /></PageLayout>} />
          <Route path="/ofertas" element={<PageLayout><Ofertas /></PageLayout>} />
          <Route path="/opiniones" element={<PageLayout><Opiniones /></PageLayout>} />

          {/* Protected Routes */}
          <Route path="/profile" element={
            <PrivateRoute>
              <PageLayout><Profile /></PageLayout>
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
          <Route path="/admin/products-advanced" element={<AdminRoute><ProductsAdvanced /></AdminRoute>} />
          <Route path="/admin/blog" element={<AdminRoute><BlogPosts /></AdminRoute>} />
          <Route path="/admin/opiniones" element={
            <AdminRoute>
              <AdminOpinion />  {/* Use correct component name */}
            </AdminRoute>
          } />

          {/* Ruta para administración de contactos */}
          <Route path="/admin/contactos" element={
            <AdminRoute>
              <ContactAdmin />
            </AdminRoute>
          } />

          {/* Rutas para edición de documentos legales */}
          <Route path="/admin/legal/terms" element={
            <AdminRoute>
              <TermsEditor />
            </AdminRoute>
          } />
          <Route path="/admin/legal/privacy" element={
            <AdminRoute>
              <PrivacyEditor />
            </AdminRoute>
          } />

          {/* Ruta para administración de servicios */}
          <Route path="/admin/servicios" element={
            <AdminRoute>
              <ServicesAdmin />
            </AdminRoute>
          } />

          {/* Ruta para administración de Inicio (Hero) */}
          <Route path="/admin/home" element={
            <AdminRoute>
              <HomeAdmin />
            </AdminRoute>
          } />

          {/* Ruta para edición de About */}
          <Route path="/admin/about" element={
            <AdminRoute>
              <AboutEditor />
            </AdminRoute>
          } />

          {/* Ruta para administración de usuarios */}
          <Route path="/admin/users" element={
            <AdminRoute>
              <UserAdmin />
            </AdminRoute>
          } />

          {/* Ruta para administración de newsletter */}
          <Route path="/admin/newsletter" element={
            <AdminRoute>
              <NewsletterSubscribers />
            </AdminRoute>
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