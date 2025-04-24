import { createClient } from '@supabase/supabase-js'

// Validar variables de entorno antes de crear el cliente
const validateEnv = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son requeridas'
    )
  }

  if (!supabaseUrl.startsWith('https://')) {
    throw new Error('VITE_SUPABASE_URL debe comenzar con https://')
  }

  if (supabaseAnonKey.length < 20) {
    throw new Error('VITE_SUPABASE_ANON_KEY parece no ser válida')
  }

  return { supabaseUrl, supabaseAnonKey }
}

const createSupabaseClient = () => {
  try {
    const { supabaseUrl, supabaseAnonKey } = validateEnv()

    // Configuración extendida del cliente Supabase
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        debug: import.meta.env.DEV
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'X-Client-Info': 'my-app/v1.0'
        }
      }
    })

    // Verificación de conexión (opcional, solo en desarrollo)
    if (import.meta.env.DEV) {
      client
        .from('users')
        .select('*', { count: 'exact', head: true })
        .then(({ error }) => {
          if (error) {
            console.error('Error conectando con Supabase:', error.message)
          } else {
            console.log('Conexión con Supabase establecida correctamente')
          }
        })
    }

    return client
  } catch (error) {
    console.error('Error al configurar Supabase:', error.message)
    // Cliente mock para manejo de errores
    return {
      auth: {
        signInWithPassword: () => Promise.reject(error),
        signUp: () => Promise.reject(error),
        signInWithOAuth: () => Promise.reject(error),
        signOut: () => Promise.reject(error)
      },
      from: () => ({
        select: () => Promise.reject(error),
        insert: () => Promise.reject(error),
        update: () => Promise.reject(error),
        delete: () => Promise.reject(error)
      })
    }
  }
}

export const supabase = createSupabaseClient()