import { supabase } from '../config/supabase';

export const legalService = {
  async getLegalDocument(type) {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .eq('document_type', type)
      .maybeSingle();

    if (error) {
      console.error('Error fetching legal document:', error);
      return null;
    }

    return data;
  },

  async getAllLegalDocuments() {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*');

    if (error) {
      console.error('Error fetching legal documents:', error);
      return [];
    }

    return data;
  },

  async createLegalDocument(documentData) {
    const { data, error } = await supabase
      .from('legal_documents')
      .insert(documentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating legal document:', error);
      throw error;
    }

    return data;
  },

  async updateLegalDocument(id, updates) {
    const { data, error } = await supabase
      .from('legal_documents')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating legal document:', error);
      throw error;
    }

    return data;
  },

  async deleteLegalDocument(id) {
    const { error } = await supabase
      .from('legal_documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting legal document:', error);
      throw error;
    }

    return true;
  }
};