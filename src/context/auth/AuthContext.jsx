import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';

const AuthContext = createContext();

// Función para generar avatar por defecto usando las iniciales
const getDefaultAvatar = (nombre = '', apellido = '') => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre + ' ' + apellido)}&background=6366f1&color=fff&bold=true&size=256`;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario y perfil al iniciar
  useEffect(() => {
    // Obtener la sesión inicial de manera asíncrona
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        if (session?.user) await fetchProfile(session.user.id);
      } catch (error) {
        console.error('Error al inicializar la autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    // Suscribirse a cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Obtener perfil desde la tabla profiles
  const fetchProfile = async (userId) => {
    try {
      // 1. Intentar obtener el perfil existente
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Enriquecer con avatar si falta
        if (!data.avatar_url) {
          data.avatar_url = getDefaultAvatar(data.nombre, data.apellido);
        }
        setProfile(data);
        return;
      }

      // 2. Si no existe, crear uno (Caso Google Auth - Primer ingreso)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [nombre, ...apellidos] = (user.user_metadata?.full_name || user.email.split('@')[0]).split(' ');
      const apellido = apellidos.join(' ') || '';
      
      const newProfile = {
        id: userId,
        email: user.email,
        nombre: nombre,
        apellido: apellido,
        avatar_url: user.user_metadata?.avatar_url || getDefaultAvatar(nombre, apellido),
        role: 'user' // Volvemos a 'user' como en el original
      };

      // Si el email es el del dueño/admin principal, podrías forzarlo aquí o dejarlo para DB
      // Por ahora respetamos el registro dinámico

      const { data: upsertedProfile, error: upsertError } = await supabase
        .from('profiles')
        .upsert(newProfile, { onConflict: 'id' })
        .select()
        .single();

      if (upsertError) throw upsertError;
      setProfile(upsertedProfile);

    } catch (error) {
      console.error('Error in fetchProfile:', error);
      if (error.code === 'PGRST116' || error.message?.includes('JWT')) {
        setProfile(null);
        setUser(null);
        await supabase.auth.signOut();
      }
    }
  };

  // Login con email/contraseña
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  // Login con Google
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account' // OBLIGA a Google a preguntar qué cuenta usar
        }
      }
    });
    if (error) throw error;
  };

  // Registro con email/contraseña
  const register = async ({ nombre, apellido, email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    
    if (data.user) {
      const avatar_url = getDefaultAvatar(nombre, apellido);
      await supabase.from('profiles').upsert({
        id: data.user.id,
        nombre,
        apellido,
        email,
        role: 'user', // Respetamos 'user' del original
        avatar_url
      }, { onConflict: 'id' });
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Verificación periódica de usuario en Supabase
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      // Verifica si el usuario sigue existiendo en Supabase
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUser(null);
        setProfile(null);
      }
    }, 60000); // cada 60 segundos
    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
