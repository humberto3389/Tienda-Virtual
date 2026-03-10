import { supabase } from '../config/supabase';

export const opinionService = {
  async getAdminOpinions({ status = 'pending' }) {
    try {
      const { data, error } = await supabase
        .from('opinions')
        .select('id,mensaje,rating,producto,created_at,status,profiles:user_id(nombre,avatar_url)')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error en getAdminOpinions:', error);
        throw error;
      }
      
      // Obtener nombres de productos por separado
      const productIds = [...new Set(data.map(opinion => opinion.producto).filter(Boolean))];
      let productNames = {};
      
      if (productIds.length > 0) {
        try {
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name')
            .in('id', productIds);
          
          if (!productsError && products) {
            productNames = products.reduce((acc, product) => {
              acc[product.id] = product.name;
              return acc;
            }, {});
          }
        } catch (productsError) {
          console.error('Error obteniendo nombres de productos admin:', productsError);
        }
      }
      
      return data.map(opinion => ({
        ...opinion,
        nombre: opinion.profiles?.nombre || 'Anónimo',
        avatar: opinion.profiles?.avatar_url || 'https://via.placeholder.com/40x40',
        producto: productNames[opinion.producto] || opinion.producto || 'Producto no encontrado'
      }));
    } catch (error) {
      console.error('Error en getAdminOpinions:', error);
      throw error;
    }
  },

  async updateOpinionStatus(opinionId, newStatus) {
    try {
      // Primero verificamos si la opinión existe
      const { data: existingOpinion, error: checkError } = await supabase
        .from('opinions')
        .select('*')
        .eq('id', opinionId)
        .single();

      if (checkError) {
        if (checkError.code === 'PGRST116') {
          throw new Error('No se encontró la opinión para actualizar');
        }
        throw checkError;
      }

      // Si llegamos aquí, la opinión existe, procedemos a actualizarla
      const { data, error } = await supabase
        .from('opinions')
        .update({ status: newStatus })
        .eq('id', opinionId)
        .select('*')
        .single();

      if (error) throw error;
      
      if (!data) {
        throw new Error('No se pudo actualizar la opinión');
      }

      return data;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  },

  async getTodasLasOpiniones() {
    try {
      const { data, error } = await supabase
        .from('opinions')
        .select('id,mensaje,rating,producto,created_at,status,profiles:user_id(nombre,avatar_url)')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error en getTodasLasOpiniones:', error);
        throw error;
      }
      
      // Obtener nombres de productos por separado
      const productIds = [...new Set(data.map(opinion => opinion.producto).filter(Boolean))];
      let productNames = {};
      
      if (productIds.length > 0) {
        try {
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name')
            .in('id', productIds);
          
          if (!productsError && products) {
            productNames = products.reduce((acc, product) => {
              acc[product.id] = product.name;
              return acc;
            }, {});
          }
        } catch (productsError) {
          console.error('Error obteniendo nombres de productos:', productsError);
        }
      }
      
      return data.map(opinion => ({
        ...opinion,
        nombre: opinion.profiles?.nombre || 'Anónimo',
        avatar: opinion.profiles?.avatar_url || 'https://via.placeholder.com/40x40',
        producto: productNames[opinion.producto] || opinion.producto || 'Producto no encontrado',
        fecha: opinion.created_at
      }));
    } catch (error) {
      console.error('Error final en getTodasLasOpiniones:', error);
      return [];
    }
  },

  async getStats() {
    try {
      const { data, error } = await supabase.rpc('get_opinion_stats');
      
      if (error) {
        console.error('Error en getStats:', error);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }
      
      return {
        success: true,
        data: {
          pending_reviews: data?.pending_reviews || 0,
          total_users: data?.total_users || 0,
          total_orders: data?.total_orders || 0,
          total_revenue: data?.total_revenue || 0,
          active_products: data?.active_products || 0
        }
      };
    } catch (error) {
      console.error('Error en getStats:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  },

  async getOpinionesDestacadas() {
    try {
      const { data, error } = await supabase
        .from('opinions')
        .select('id,mensaje,rating,producto,created_at,status,profiles:user_id(nombre,avatar_url)')
        .eq('status', 'approved')
        .gte('rating', 4)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error en getOpinionesDestacadas:', error);
        throw error;
      }
      
      // Obtener nombres de productos por separado
      const productIds = [...new Set(data.map(opinion => opinion.producto).filter(Boolean))];
      let productNames = {};
      
      if (productIds.length > 0) {
        try {
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name')
            .in('id', productIds);
          
          if (!productsError && products) {
            productNames = products.reduce((acc, product) => {
              acc[product.id] = product.name;
              return acc;
            }, {});
          }
        } catch (productsError) {
          console.error('Error obteniendo nombres de productos destacadas:', productsError);
        }
      }
      
      return data.map(opinion => ({
        ...opinion,
        nombre: opinion.profiles?.nombre || 'Anónimo',
        avatar: opinion.profiles?.avatar_url || 'https://via.placeholder.com/40x40',
        producto: productNames[opinion.producto] || opinion.producto || 'Producto no encontrado',
        fecha: opinion.created_at
      }));
    } catch (error) {
      console.error('Error final en getOpinionesDestacadas:', error);
      return [];
    }
  },

  async crearOpinion({ producto, mensaje, rating }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Determinar si el usuario es verificado (puedes ajustar esta lógica)
      const isVerifiedUser = user?.user_metadata?.verified || 
                            user?.user_metadata?.role === 'admin' ||
                            user?.email?.includes('@jerzystore.com'); // Emails de la empresa
      
      const { data, error } = await supabase
        .from('opinions')
        .insert([{
          user_id: user.id,
          producto,
          mensaje,
          rating,
          status: isVerifiedUser ? 'approved' : 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear opinión:', error);
      throw error;
    }
  },
};