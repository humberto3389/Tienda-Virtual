// src/services/newsletterService.js
import { supabase } from '../config/supabase';

export const newsletterService = {
  subscribe: async (email) => {
    try {
      if (!email || !email.includes('@') || !email.includes('.')) {
        throw new Error('Por favor ingresa un correo electrónico válido');
      }

      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])
        .select();

      if (error) {
        if (error.code === '23505') {
          return { success: false, message: '¡Ya estás suscrito a nuestro newsletter!' };
        }
        throw error;
      }

      return { success: true, message: '¡Gracias por suscribirte! Pronto recibirás nuestras novedades.' };
    } catch (error) {
      console.error('Error al suscribirse:', error);
      return { success: false, message: error.message || 'Ocurrió un error al procesar tu suscripción' };
    }
  },

  getSubscribers: async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener suscriptores:', error);
      return { success: false, message: error.message };
    }
  },

  deleteSubscriber: async (id) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, message: 'Suscriptor eliminado correctamente' };
    } catch (error) {
      console.error('Error al eliminar suscriptor:', error);
      return { success: false, message: error.message };
    }
  }
};