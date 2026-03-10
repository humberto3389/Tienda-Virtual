// Configuración de WhatsApp
export const whatsappConfig = {
  // Número de WhatsApp de JerzyStore (Perú)
  // +51 973 295 101
  number: '51973295101', // Número de JerzyStore
  
  // Mensaje por defecto para consultas generales
  defaultMessage: '¡Hola! Me interesa uno de sus productos. ¿Podrían ayudarme?',
  
  // Configuración adicional
  settings: {
    // Si quieres que se abra en una nueva ventana
    openInNewTab: true,
    
    // Si quieres incluir el nombre de la empresa en los mensajes
    companyName: 'JerzyStore',
    
    // Horarios de atención (opcional)
    businessHours: {
      enabled: false,
      message: 'Horario de atención: Lunes a Viernes de 9:00 a 18:00',
      timezone: 'America/Lima'
    }
  }
};

// Función helper para generar URL de WhatsApp
export const generateWhatsAppUrl = (message, number = whatsappConfig.number) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedMessage}`;
};

// Función helper para abrir WhatsApp
export const openWhatsApp = (message, number = whatsappConfig.number) => {
  const url = generateWhatsAppUrl(message, number);
  if (whatsappConfig.settings.openInNewTab) {
    window.open(url, '_blank');
  } else {
    window.location.href = url;
  }
};
