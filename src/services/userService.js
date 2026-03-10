import { supabase } from '../config/supabase';

export const userService = {
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUserById(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data;
  },

  async deleteUser(userId) {
    // Primero eliminamos el perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) throw profileError;

    // Luego eliminamos el usuario de auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) throw authError;

    return { success: true };
  },

  async createUser({ email, password, nombre, apellido, role = 'user' }) {
    // Crear usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Crear perfil en profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email,
          nombre,
          apellido,
          role,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre + ' ' + apellido)}&background=6366f1&color=fff&bold=true&size=256`
        }
      ])
      .select();

    if (profileError) {
      // Si falla la creación del perfil, eliminar el usuario de auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return profileData[0];
  },

  async updateUserRole(userId, newRole) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data[0];
  }
};