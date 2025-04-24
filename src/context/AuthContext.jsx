import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
      } else {
        setUser(session?.user ?? null);
        if (session?.user) {
          await handleUserSync(session.user);
        }
      }
      setLoading(false);
    });

    // Verificar sesión inicial
    const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) console.error('Error checking session:', error);
    setUser(session?.user ?? null);
    setLoading(false);
  };
  checkSession();

  return () => subscription.unsubscribe();
}, []);

  // Función para sincronizar usuario con la tabla public.usuarios
  const handleUserSync = async (user) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          role: user.user_metadata?.role || 'user',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al sincronizar usuario:', error);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    
    // Sincronizar usuario después del login
    if (data.user) {
      await handleUserSync(data.user);
    }
    
    return data;
  };

  const register = async (email, password, fullName) => {
    try {
      // 1. Registro en auth.users
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName, 
            role: 'user' 
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      // 2. Si el usuario está confirmado inmediatamente (puede suceder en algunos casos)
      if (data.user) {
        await handleUserSync(data.user);
      }

      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: window.location.origin + '/auth/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    if (error) throw new Error(error.message);
    return data;
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null); // Asegurarse de limpiar el estado
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      loginWithGoogle, 
      logout,
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}