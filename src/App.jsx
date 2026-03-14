import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/ui/Navbar'
import Footer from './components/ui/Footer'
import PageLayout from './components/ui/PageLayout'
import WhatsAppButton from './components/WhatsAppButton'
import LoadingSpinner from './components/ui/LoadingSpinner'
import Home from './pages/Home'

// Lazy loaded components
const Shop = lazy(() => import('./pages/Shop'))
const Services = lazy(() => import('./pages/Services'))
const Blog = lazy(() => import('./pages/Blog'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PrivateRoute = lazy(() => import('./components/auth/PrivateRoute'))
const AdminRoute = lazy(() => import('./components/auth/AdminRoute'))
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'))
const About = lazy(() => import('./pages/About'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const ServicioDetalle = lazy(() => import('./pages/ServicioDetalle'))
const Ofertas = lazy(() => import('./pages/Ofertas'))
const Opiniones = lazy(() => import('./pages/Opiniones'))
const BlogPosts = lazy(() => import('./pages/Admin/BlogPosts'))
const AdminOpinion = lazy(() => import('./pages/Admin/AdminOpinion'))
const ContactAdmin = lazy(() => import('./pages/Admin/ContactAdmin'))
const TermsEditor = lazy(() => import('./pages/Admin/Legal/TermsEditor'))
const PrivacyEditor = lazy(() => import('./pages/Admin/Legal/PrivacyEditor'))
const AboutEditor = lazy(() => import('./pages/Admin/AboutEditor'))
const UserAdmin = lazy(() => import('./pages/Admin/UserAdmin'))
const NewsletterSubscribers = lazy(() => import('./pages/Admin/NewsletterSubscribers'))
const Products = lazy(() => import('./pages/Admin/Products'))
const ProductsAdvanced = lazy(() => import('./pages/Admin/ProductsAdvanced'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const ServicesAdmin = lazy(() => import('./pages/Admin/ServicesAdmin'))
const HomeAdmin = lazy(() => import('./pages/Admin/HomeAdmin'))

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner size="md" color="gradient" />
          </div>
        }>
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
                <AdminOpinion />
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
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App