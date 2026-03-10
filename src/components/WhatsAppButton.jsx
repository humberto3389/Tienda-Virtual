import { FaWhatsapp } from 'react-icons/fa6';

const WhatsAppButton = () => {
  const phoneNumber = '51973295101';
  const message = `👋 *CONSULTA GENERAL*

¡Hola! Me gustaría obtener más información sobre:

• Productos disponibles
• Servicios técnicos  
• Precios y promociones
• Formas de pago
• Envíos y entregas

¿Podrías ayudarme con esta información?

¡Gracias! 😊`;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative animate-pulse-slow">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-gradient"></div>
        
          <a
            href={`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center p-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-bounce-slow"
          >
           <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-full"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
           
           <div className="absolute inset-0 rounded-full p-[1.5px] bg-gradient-to-br from-green-400 to-green-600 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
             <div className="absolute inset-0 rounded-full bg-white dark:bg-gray-800 m-[1.5px]"></div>
           </div>
           
           <div className="relative z-10">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
               <FaWhatsapp className="text-white text-2xl transform group-hover:rotate-12 transition-transform duration-300" />
             </div>
           </div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
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
      `}} />
    </div>
  );
};

export default WhatsAppButton;