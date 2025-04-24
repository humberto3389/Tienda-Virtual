import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = '973295101';
  const message = 'Hola, me gustaría obtener más información sobre tus productos y servicios';

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Contenedor de la sombra con gradiente */}
      <div className="relative animate-pulse-slow">
        {/* Sombra con gradiente animada */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-gradient"></div>
        
        <a
          href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-bounce-slow"
        >
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Efecto de borde con gradiente */}
          <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-green-500 to-green-600 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-full bg-white dark:bg-gray-800"></div>
          </div>
          
          {/* Icono con efectos */}
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <FaWhatsapp className="text-white text-lg transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          
          {/* Texto que aparece al hover */}
          <div className="relative z-10">
            <span className="text-sm font-medium text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 whitespace-nowrap">
              WhatsApp
            </span>
          </div>
          
          {/* Efecto de hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default WhatsAppButton;