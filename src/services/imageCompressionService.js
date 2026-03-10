import imageCompression from 'browser-image-compression';

export const imageCompressionService = {
  /**
   * Comprime una imagen manteniendo una buena relación calidad/tamaño
   * @param {File} imageFile - El archivo de imagen original
   * @param {Object} options - Opciones de compresión personalizadas (opcional)
   * @returns {Promise<File>} - Archivo de imagen comprimido
   */
  async compressImage(imageFile, customOptions = {}) {
    if (!imageFile || !imageFile.type.startsWith('image/')) {
      throw new Error('El archivo proporcionado no es una imagen válida');
    }

    // Opciones predeterminadas de compresión
    const defaultOptions = {
      maxSizeMB: 0.8, // Bajamos el peso máximo para mayor compresión
      maxWidthOrHeight: 1600, // Dimensión máxima óptima para web
      useWebWorker: true,
      initialQuality: 0.8,
      preserveExif: false,
      fileType: 'image/webp', // Cambiamos a WebP para máxima eficiencia
    };

    // Combinar opciones predeterminadas con opciones personalizadas
    const options = { ...defaultOptions, ...customOptions };

    try {
      // Siempre comprimimos y convertimos a WebP si es posible para ahorrar espacio brutalmente
      const compressedFile = await imageCompression(imageFile, options);
      
      return compressedFile;
    } catch (error) {
      console.error('Error al comprimir la imagen:', error);
      throw new Error('No se pudo comprimir la imagen: ' + error.message);
    }
  },

  /**
   * Compresión brutal: máxima eficiencia sin perder nitidez perceptible
   */
  async compressBrutal(imageFile) {
    return this.compressImage(imageFile, {
      maxSizeMB: 0.4, // Muy ligero
      maxWidthOrHeight: 1280,
      initialQuality: 0.75,
      fileType: 'image/webp'
    });
  },

  /**
   * Comprime una imagen con alta calidad (menos compresión)
   */
  async compressHighQuality(imageFile) {
    return this.compressImage(imageFile, {
      maxSizeMB: 1.5,
      initialQuality: 0.9,
      fileType: 'image/webp'
    });
  },

  /**
   * Comprime una imagen con calidad media (balance entre tamaño y calidad)
   */
  async compressMediumQuality(imageFile) {
    return this.compressImage(imageFile, {
      maxSizeMB: 0.8,
      initialQuality: 0.8,
      fileType: 'image/webp'
    });
  },

  /**
   * Comprime una imagen con baja calidad (máxima compresión)
   */
  async compressLowQuality(imageFile) {
    return this.compressImage(imageFile, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1024,
      initialQuality: 0.6,
      fileType: 'image/webp'
    });
  },

  /**
   * Comprime una imagen para miniatura
   */
  async compressThumbnail(imageFile) {
    return this.compressImage(imageFile, {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 400,
      initialQuality: 0.7,
      fileType: 'image/webp'
    });
  }
};