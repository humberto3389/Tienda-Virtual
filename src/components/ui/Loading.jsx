export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex flex-col justify-center items-center gap-6">
      {/* Spinner con gradiente animado y efecto 3D */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 blur-lg opacity-30 animate-pulse"></div>
        <div 
          className="relative h-20 w-20 rounded-full border-[3px] border-transparent"
          style={{
            background: `
              conic-gradient(from 0deg at 50% 50%, 
                rgba(255,255,255,0) 0%, 
                #a855f7 20%, 
                #ec4899 60%, 
                rgba(255,255,255,0) 100%
              ),
              radial-gradient(circle at center, #111827 60%, transparent 70%)
            `,
            animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
          }}
        ></div>
      </div>

      {/* Texto con animación sutil */}
      <div className="flex flex-col items-center">
        <p className="text-lg font-medium text-white mb-1">Cargando contenido</p>
        <p className="text-sm text-gray-400">Por favor espere un momento</p>
      </div>

      {/* Barra de progreso sutil */}
      <div className="w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-2">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
          style={{
            animation: 'progress 2.5s ease-in-out infinite',
            width: '30%'
          }}
        ></div>
      </div>

      {/* Estilos de animación globales (añadir a tu CSS global) */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); width: 10%; }
          50% { width: 50%; }
          100% { transform: translateX(250%); width: 10%; }
        }
      `}</style>
    </div>
  )
}