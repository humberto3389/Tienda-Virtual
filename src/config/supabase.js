import { createClient } from '@supabase/supabase-js'

const validateEnv = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  // Mejorar mensajes de error
  if (!supabaseUrl) throw new Error('VITE_SUPABASE_URL no está definida en .env')
  if (!supabaseAnonKey) throw new Error('VITE_SUPABASE_ANON_KEY no está definida en .env')
  
  // Validación más estricta de URL
  try {
    new URL(supabaseUrl)
  } catch {
    throw new Error('VITE_SUPABASE_URL no es una URL válida')
  }

  // Validación de estructura de la clave
  if (!/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJ/.test(supabaseAnonKey)) {
    throw new Error('La clave anónima no parece ser un JWT válido')
  }

  return { supabaseUrl, supabaseAnonKey }
}

const createSupabaseClient = () => {
  try {
    const { supabaseUrl, supabaseAnonKey } = validateEnv()

    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        debug: false,
        storage: {
          getItem: (key) => localStorage.getItem(key),
          setItem: (key, value) => localStorage.setItem(key, value),
          removeItem: (key) => localStorage.removeItem(key)
        }
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'X-Client-Info': 'yerzystore/v1.0',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    })

    // Healthcheck silencioso (solo errores críticos)
    const healthCheck = async () => {
      try {
        const { error } = await client
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .limit(1)
        if (error) console.error('[Supabase] Error de conexión:', error.message)
      } catch (error) {
        console.error('[Supabase] Error de conexión:', error.message)
      }
    }
    setTimeout(healthCheck, 1000)

    return client
  } catch (error) {
    console.error('[Supabase] Error crítico:', error.message)
    
    // Mock client mejorado para producción
    return import.meta.env.PROD ? {
      auth: { 
        getSession: () => Promise.resolve({ data: { session: null }, error: error }) 
      }
    } : Promise.reject(error)
  }
}

export const supabase = createSupabaseClient()