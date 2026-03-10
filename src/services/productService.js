import { supabase } from '../config/supabase';

// Funciones para manejar productos
const getAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id(*),
        product_variants(*),
        product_images(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

const getProductsByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return [];
  }
};

// Función para obtener productos con filtros y paginación
const getProducts = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      category = '',
      featured = false,
      discounted = false,
      is_active = true,
      minPrice = 0,
      maxPrice = 1000000
    } = options;

    let query = supabase
      .from('products')
      .select(`
        *,
        categories:category_id(*),
        product_variants(price_override, stock),
        product_images(*)
      `, { count: 'exact' });

    // Aplicar filtros dinámicos
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category_id', category);
    }

    if (featured) {
      query = query.eq('is_featured', true);
    }

    if (discounted) {
      query = query.gt('discount', 0);
    }

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active);
    }

    // Filtro de precio (solo si se proporcionan valores válidos)
    if (minPrice != null && !isNaN(minPrice)) {
      query = query.gte('price', minPrice);
    }
    if (maxPrice != null && !isNaN(maxPrice)) {
      query = query.lte('price', maxPrice);
    }

    // Aplicar paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Ordenar (Más reciente primero para novedades)
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      data: data || [],
      total: count || 0,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: error.message,
      data: [],
      total: 0,
      totalPages: 0,
      currentPage: 1
    };
  }
};

// Función para obtener categorías
const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    // Obtener el conteo de productos para cada categoría
    const categoriesWithCount = await Promise.all(
      data.map(async (category) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('is_active', true);

        return {
          ...category,
          product_count: count || 0
        };
      })
    );

    return {
      success: true,
      data: categoriesWithCount
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// Función para obtener subcategorías
const getSubcategories = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// Función para crear un producto
const createProduct = async (productData) => {
  try {
    // Generar slug si no existe
    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100);
    }

    // Establecer fecha de publicación si no existe
    if (!productData.published_at && productData.is_active) {
      productData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select(`
        *,
        categories:category_id(name),
        subcategories:subcategory_id(name),
        brands:brand_id(name)
      `)
      .single();

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para actualizar un producto
const updateProduct = async (id, productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para eliminar un producto
const deleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para obtener estadísticas de productos
const getProductStats = async () => {
  try {
    const [
      { count: totalProducts },
      { count: featuredProducts },
      { count: lowStockProducts },
      { data: valueData }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock', 10),
      supabase.from('products').select('price, stock')
    ]);

    const totalValue = valueData?.reduce((sum, product) => {
      return sum + (product.price * product.stock);
    }, 0) || 0;

    return {
      success: true,
      data: {
        totalProducts: totalProducts || 0,
        featuredProducts: featuredProducts || 0,
        lowStockProducts: lowStockProducts || 0,
        totalValue
      }
    };
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return {
      success: false,
      error: error.message,
      data: {
        totalProducts: 0,
        featuredProducts: 0,
        lowStockProducts: 0,
        totalValue: 0
      }
    };
  }
};

// Función para obtener estadísticas de rating de múltiples productos
const getMultipleProductsRatingStats = async (productIds) => {
  try {
    const { data, error } = await supabase
      .from('opinions')
      .select('producto, rating')
      .in('producto', productIds)
      .eq('status', 'approved');

    if (error) throw error;

    // Procesar estadísticas por producto
    const stats = {};
    productIds.forEach(id => {
      const productReviews = data?.filter(review => review.producto === id) || [];
      const totalReviews = productReviews.length;
      const averageRating = totalReviews > 0 
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

      stats[id] = {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10
      };
    });

    return {
      success: true,
      data: stats
    };
  } catch (error) {
    console.error('Error fetching rating stats:', error);
    return {
      success: false,
      error: error.message,
      data: {}
    };
  }
};

// Función para obtener opiniones de un producto específico
const getProductOpinions = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('opinions')
      .select('*, profiles:user_id(nombre,avatar_url)')
      .eq('producto', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mappedData = data.map(opinion => ({
        ...opinion,
        nombre: opinion.profiles?.nombre || 'Anónimo',
        avatar: opinion.profiles?.avatar_url || 'https://via.placeholder.com/40x40',
        fecha: opinion.created_at
    }));

    return {
      success: true,
      data: mappedData || []
    };
  } catch (error) {
    console.error('Error fetching product opinions:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// Función para obtener estadísticas de rating de un producto específico
const getProductRatingStats = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('opinions')
      .select('rating')
      .eq('producto', productId)
      .eq('status', 'approved');

    if (error) throw error;

    const totalReviews = data?.length || 0;
    const averageRating = totalReviews > 0 
      ? data.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    return {
      success: true,
      data: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10
      }
    };
  } catch (error) {
    console.error('Error fetching product rating stats:', error);
    return {
      success: false,
      error: error.message,
      data: {
        totalReviews: 0,
        averageRating: 0
      }
    };
  }
};

// Función para subir múltiples imágenes de producto
const uploadProductImages = async (productId, imageFiles) => {
  try {
    const { storageService } = await import('./storageService');
    
    // Subir todas las imágenes
    const imageUrls = await storageService.uploadMultipleProductImages(imageFiles);
    
    // Guardar las imágenes en la base de datos
    const imageRecords = imageUrls.map((url, index) => ({
      product_id: productId,
      image_url: url,
      sort_order: index,
      is_primary: index === 0
    }));

    const { data, error } = await supabase
      .from('product_images')
      .insert(imageRecords)
      .select();

    if (error) throw error;

    return {
      success: true,
      data: imageRecords
    };
  } catch (error) {
    console.error('Error uploading product images:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para obtener imágenes de un producto
const getProductImages = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order');

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Error fetching product images:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// Función para obtener marcas
const getBrands = async () => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Error fetching brands:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// Función para obtener atributos de productos
const getProductAttributes = async () => {
  try {
    const { data, error } = await supabase
      .from('product_attributes')
      .select(`
        *,
        values:product_attribute_values(*)
      `)
      .order('sort_order');

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Error fetching product attributes:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// Función para crear variantes de producto
const createProductVariant = async (variantData) => {
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .insert([variantData])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error creating product variant:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para obtener variantes de un producto
const getProductVariants = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)
      .order('price_override', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// Nueva función para obtener atributos dinámicos segun categoría
const getAttributesByCategory = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from('product_attributes')
      .select(`
        *,
        values:product_attribute_values(*)
      `)
      .eq('category_id', categoryId);

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Error fetching category attributes:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para sincronizar imágenes de producto
const syncProductImages = async (productId, images) => {
  try {
    // 1. Eliminar imágenes actuales para este producto
    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId);

    if (deleteError) throw deleteError;

    // 2. Si no hay imágenes nuevas, terminar
    if (!images || images.length === 0) {
      return { success: true };
    }

    // 3. Insertar las nuevas imágenes
    const imageRecords = images.map((img, index) => ({
      product_id: productId,
      image_url: typeof img === 'string' ? img : img.image_url,
      sort_order: index,
      is_primary: index === 0
    }));

    const { data, error: insertError } = await supabase
      .from('product_images')
      .insert(imageRecords);

    if (insertError) throw insertError;

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error syncing product images:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Exportamos las funciones como un objeto llamado productService
export const productService = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProducts,
  getCategories,
  getSubcategories,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getMultipleProductsRatingStats,
  getProductOpinions,
  getProductRatingStats,
  uploadProductImages,
  getProductImages,
  syncProductImages,
  getBrands,
  getProductAttributes,
  getAttributesByCategory,
  createProductVariant,
  getProductVariants
};