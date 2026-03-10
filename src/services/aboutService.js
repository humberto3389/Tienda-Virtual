import { supabase } from '../config/supabase';

export const aboutService = {
  subscribeToChanges(callback) {
    const subscription = supabase
      .channel('about_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'about_content'
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(subscription);
      }
    };
  },

  async getAboutContent() {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching about content:', error);
      throw error;
    }
  },

  async updateAboutContent(id, updates) {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating about content:', error);
      throw error;
    }
  },

  async createAboutContent(contentData) {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .insert(contentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating about content:', error);
      throw error;
    }
  }
};