import { supabase } from '../config/supabase';

export const serviceService = {
  /**
   * Obtener todos los servicios
   */
  getServices: async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error in getServices:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener un servicio por ID
   */
  getServiceById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error in getServiceById:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Crear un nuevo servicio
   */
  createService: async (serviceData) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error in createService:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Actualizar un servicio existente
   */
  updateService: async (id, serviceData) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateService:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Eliminar un servicio
   */
  deleteService: async (id) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error in deleteService:', error);
      return { success: false, error: error.message };
    }
  }
};
