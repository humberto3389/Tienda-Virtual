// src/services/contactService.js
import { supabase } from '../config/supabase';

export const contactService = {
  async upsertContactInfo(type, data) {
    const { value, description } = data;
    
    const { data: result, error } = await supabase
      .from('contact_info')
      .upsert(
        { type, value, description },
        { onConflict: 'type' }
      );
      
    if (error) {
      console.error('Error en upsertContactInfo:', error);
    }
    
    return { data: result, error };
  },

  async getContactMap() {
    // Esta función es pública - cualquiera puede acceder a ella
    const { data } = await supabase
      .from('contact_info')
      .select('value')
      .eq('type', 'map_url')
      .single();
    return data?.value || '';
  },
  
  async getUserLastMessage(email) {
    if (!email) return null;
    
    try {
      // Los usuarios autenticados pueden ver sus propios mensajes
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error al obtener el último mensaje del usuario:', error);
      return null;
    }
  },

  async submitContactMessage(messageData) {
    try {
      // Esta función es pública - cualquiera puede enviar mensajes
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: messageData.name,
          email: messageData.email,
          subject: messageData.subject,
          message: messageData.message,
          metadata: { read: false }
        }])
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      return { data: null, error };
    }
  },
  
  async getContactInfo() {
    try {
      // Esta función es pública - cualquiera puede ver la información de contacto
      const { data, error } = await supabase
        .from('contact_info')
        .select('*');
      
      if (error) {
        console.error('Error al obtener información de contacto:', error);
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error en getContactInfo:', error);
      return { data: [], error };
    }
  },

  async updateContactInfo(id, updates) {
    // Solo administradores pueden actualizar la información de contacto
    const { data, error } = await supabase
      .from('contact_info')
      .update(updates)
      .eq('id', id);
    return { data, error };
  },

  async getFAQs() {
    // Esta función es pública - cualquiera puede ver las FAQs
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });
    return { data, error };
  },

  async addFAQ(faq) {
    // Solo administradores pueden añadir FAQs
    const { data, error } = await supabase
      .from('faqs')
      .insert(faq);
    return { data, error };
  },

  async updateFAQ(id, updates) {
    // Solo administradores pueden actualizar FAQs
    const { data, error } = await supabase
      .from('faqs')
      .update(updates)
      .eq('id', id);
    return { data, error };
  },

  async deleteFAQ(id) {
    // Solo administradores pueden eliminar FAQs
    const { data, error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);
    return { data, error };
  },

  async getMessages(status) {
    // Solo administradores pueden ver todos los mensajes
    let query = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
  
    if (status === 'unread') {
      // Filtrar mensajes no leídos
      query = query.eq('metadata->read', false);
    }
  
    const { data, error } = await query;
    if (error) console.error('Error al obtener mensajes:', error);
    return { data: data || [], error };
  },

  async markMessageAsRead(id) {
    try {
      // Solo administradores pueden marcar mensajes como leídos
      // Primero obtenemos el mensaje actual para preservar otros campos de metadata
      const { data: currentMessage } = await supabase
        .from('contact_messages')
        .select('metadata')
        .eq('id', id)
        .single();
      
      // Actualizamos solo el campo read manteniendo el resto de metadata
      const updatedMetadata = { 
        ...currentMessage?.metadata,
        read: true 
      };
      
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ metadata: updatedMetadata })
        .eq('id', id)
        .select();
        
      return { data, error };
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error);
      return { data: null, error };
    }
  },

  async deleteMessage(id) {
    // Solo administradores pueden eliminar mensajes
    const { data, error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    return { data, error };
  },
};