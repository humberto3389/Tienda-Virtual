export const routes = {
  // Public routes
  home: '/',
  about: '/about',
  shop: '/shop',
  productDetail: '/product/:id',
  blog: '/blog',
  blogPost: '/blog/:id',
  contact: '/contact',
  services: '/services',
  serviceDetail: '/services/:id',
  categories: '/categories',
  terms: '/terms',
  privacy: '/privacy',

  // Auth routes
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  // Protected routes
  profile: '/profile',
  // Admin routes
  admin: {
    dashboard: '/admin',
    products: '/admin/products',
    productsAdvanced: '/admin/products-advanced',
    productForm: '/admin/products/new',
    productEdit: '/admin/products/:id/edit',
    categories: '/admin/categories',
    blog: '/admin/blog',
    blogPost: '/admin/blog/:id',
    services: '/admin/services',
    messages: '/admin/messages',
    banners: '/admin/banners',
    settings: '/admin/settings',
    seed: '/admin/seed',
    terms: '/admin/legal/terms',
    privacy: '/admin/legal/privacy'
  }
};