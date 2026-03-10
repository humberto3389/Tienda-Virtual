import { supabase } from '../config/supabase';

export const homeService = {
  async getHeroData() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'home_hero')
        .single();

      if (error) throw error;
      return { success: true, data: data.value };
    } catch (error) {
      console.error('Error fetching hero data:', error);
      return { success: false, error: error.message };
    }
  },

  async updateHeroData(heroData) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ value: heroData, updated_at: new Date() })
        .eq('key', 'home_hero')
        .select();

      if (error) throw error;
      return { success: true, data: data[0].value };
    } catch (error) {
      console.error('Error updating hero data:', error);
      return { success: false, error: error.message };
    }
  }
};
