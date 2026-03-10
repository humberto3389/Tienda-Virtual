import { supabase } from '../config/supabase';
import { imageCompressionService } from './imageCompressionService';
// Nota: videoCompressionService se importa dinámicamente en uploadVideo

const sanitizeFileName = (name) => {
  return name
    .normalize('NFD') // Descomponer caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Eliminar los acentos
    .replace(/ñ/g, 'n').replace(/Ñ/g, 'N')
    .replace(/[^\w.-]/g, '_') // Reemplazar todo lo que no sea letra, número, punto o guión por guion bajo
    .replace(/\s+/g, '_') // Reemplazar espacios por guiones bajos
    .toLowerCase(); // Todo a minúsculas para consistencia
};

export const storageService = {
  async uploadImage(file, compressionLevel = 'medium', bucket = 'blog-images') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');
    
    // Comprimir la imagen antes de subirla
    let compressedFile;
    try {
      switch (compressionLevel) {
        case 'high':
          compressedFile = await imageCompressionService.compressHighQuality(file);
          break;
        case 'medium':
          compressedFile = await imageCompressionService.compressMediumQuality(file);
          break;
        case 'low':
          compressedFile = await imageCompressionService.compressLowQuality(file);
          break;
        case 'thumbnail':
          compressedFile = await imageCompressionService.compressThumbnail(file);
          break;
        case 'none':
          compressedFile = file;
          break;
        default:
          compressedFile = await imageCompressionService.compressMediumQuality(file);
      }
    } catch (error) {
      compressedFile = file;
    }
    
    const sanitizedName = sanitizeFileName(file.name);
    const fileName = `${user.id}/${crypto.randomUUID()}-${sanitizedName}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, compressedFile, {
        upsert: false,
        contentType: compressedFile.type,
        cacheControl: '3600'
      });

    if (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    }
    
    return `${supabase.storage.url}/object/public/${bucket}/${data.path}`;
  },

  async uploadProductImage(file, compressionLevel = 'medium') {
    try {
      return await this.uploadImage(file, compressionLevel, 'product-images');
    } catch (error) {
      console.error('Error uploading product image:', error);
      // Fallback a blog-images si el bucket específico no existe o falla
      return await this.uploadImage(file, compressionLevel, 'blog-images');
    }
  },

  async uploadServiceImage(file, compressionLevel = 'medium') {
    try {
      return await this.uploadImage(file, compressionLevel, 'service-images');
    } catch (error) {
      console.error('Error uploading service image:', error);
      // Fallback a blog-images
      return await this.uploadImage(file, compressionLevel, 'blog-images');
    }
  },

  async uploadMultipleProductImages(files, compressionLevel = 'medium') {
    const uploadPromises = files.map(file => 
      this.uploadProductImage(file, compressionLevel)
    );
    
    try {
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading multiple product images:', error);
      throw error;
    }
  },

  async uploadVideo(file, compressionLevel = 'medium') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');
    
    // Los videos se suben sin compresión (compresión del lado del cliente no soportada)
    const compressedFile = file;
    
    const sanitizedName = sanitizeFileName(file.name);
    const fileName = `${user.id}/${crypto.randomUUID()}-${sanitizedName}`;
    
    const { data, error } = await supabase.storage
      .from('blog-videos')
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: compressedFile.type
      });

    if (error) {
      console.error('Error subiendo video:', error);
      throw error;
    }
    
    return `${supabase.storage.url}/object/public/blog-videos/${data.path}`;
  },

  async deleteFile(url) {
    if (!url) return true;
    
    try {
      const bucket = url.includes('blog-images') ? 'blog-images' : 'blog-videos';
      const filePath = url.split('/object/public/')[1];
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error eliminando archivo:', error);
      throw error;
    }
  },

  async updateFile(oldUrl, newFile, compressionLevel = 'medium') {
    // Eliminar el archivo antiguo primero
    if (oldUrl) {
      await this.deleteFile(oldUrl).catch(() => {});
    }
    
    // Subir el nuevo archivo
    if (newFile.type.startsWith('image/')) {
      return this.uploadImage(newFile, compressionLevel);
    } else if (newFile.type.startsWith('video/')) {
      return this.uploadVideo(newFile);
    }
    
    throw new Error('Tipo de archivo no soportado');
  }
};