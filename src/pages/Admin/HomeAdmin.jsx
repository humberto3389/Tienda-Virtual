import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';
import { homeService } from '@/services/homeService';
import { storageService } from '@/services/storageService';
import { PhotoIcon, VideoCameraIcon, ArrowUpTrayIcon, CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HomeAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroData, setHeroData] = useState({
    media_url: '',
    media_type: 'image',
    badge: '',
    title_primary: '',
    title_secondary: '',
    subtitle: '',
    button_primary_text: '',
    button_primary_url: '',
    button_secondary_text: '',
    button_secondary_url: ''
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    setLoading(true);
    const result = await homeService.getHeroData();
    if (result.success) {
      setHeroData(result.data);
    } else {
      toast.error('Error al cargar datos del Hero');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeroData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      let url;
      if (type === 'image') {
        url = await storageService.uploadImage(file, 'none', 'blog-images');
      } else {
        url = await storageService.uploadVideo(file);
      }
      setHeroData(prev => ({ ...prev, media_url: url, media_type: type }));
      toast.success(`${type === 'image' ? 'Imagen' : 'Video'} listo para guardar`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error al subir archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await homeService.updateHeroData(heroData);
    if (result.success) {
      toast.success('Hero actualizado correctamente');
    } else {
      toast.error('Error al guardar cambios');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <ArrowPathIcon className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">
      <div className="flex justify-between items-end">
         <div>
            <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase">Gestión de Inicio</h1>
            <p className="text-stone-400 text-sm mt-2 font-medium tracking-widest uppercase">Personaliza el Hero principal (Yersiman Connect)</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Lado Izquierdo: Formulario */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8 bg-white dark:bg-[#111] border border-stone-200 dark:border-white/5 rounded-[3rem] p-10 shadow-2xl">
          <div className="space-y-6">
            <h2 className="text-xs font-black tracking-[0.3em] text-indigo-500 uppercase flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" /> Textos del Hero
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Etiqueta (Badge)</label>
                <input 
                  name="badge" value={heroData.badge} onChange={handleChange}
                  className="w-full bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:ring-2 ring-indigo-500/20"
                />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Título Primario</label>
                <input 
                  name="title_primary" value={heroData.title_primary} onChange={handleChange}
                  className="w-full bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm"
                />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Título Secundario (Gradient)</label>
                <input 
                  name="title_secondary" value={heroData.title_secondary} onChange={handleChange}
                  className="w-full bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Subtítulo Descriptivo</label>
              <textarea 
                name="subtitle" value={heroData.subtitle} onChange={handleChange} rows={3}
                className="w-full bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-white/10 rounded-3xl px-5 py-4 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Botón Principal - Texto</label>
                 <input name="button_primary_text" value={heroData.button_primary_text} onChange={handleChange} className="w-full bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Botón Principal - URL</label>
                 <input name="button_primary_url" value={heroData.button_primary_url} onChange={handleChange} className="w-full bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-stone-100 dark:border-white/5">
            <button 
              type="submit" disabled={saving}
              className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-xs font-black tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>

        {/* Lado Derecho: Multimedia & Preview */}
        <div className="space-y-8">
           <div className="bg-white dark:bg-[#111] border border-stone-200 dark:border-white/5 rounded-[3rem] p-8 shadow-xl">
              <h2 className="text-[10px] font-black tracking-[0.3em] text-indigo-500 uppercase mb-8">Multimedia Background</h2>
              
              <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-stone-100 dark:bg-black/40 relative group">
                {heroData.media_type === 'image' ? (
                  <img src={heroData.media_url} className="w-full h-full object-cover" alt="Hero Preview" />
                ) : (
                  <video src={heroData.media_url} className="w-full h-full object-cover" autoPlay muted loop />
                )}
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <ArrowPathIcon className="w-8 h-8 animate-spin text-white" />
                  </div>
                )}
                
                <div className="absolute inset-x-4 bottom-4 flex gap-2">
                   <label className="flex-1 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors border border-white/20">
                      <PhotoIcon className="w-5 h-5 text-indigo-500 mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest">IMAGEN</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
                   </label>
                   <label className="flex-1 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors border border-white/20">
                      <VideoCameraIcon className="w-5 h-5 text-purple-500 mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest">VIDEO</span>
                      <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" />
                   </label>
                </div>
              </div>
           </div>

           <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20">
              <div className="flex gap-2 mb-4">
                 <CheckCircleIcon className="w-5 h-5" />
                 <span className="text-[10px] font-black tracking-widest uppercase">Tip Pro</span>
              </div>
              <p className="text-xs font-medium leading-relaxed opacity-90">
                Usa videos minimalistas (texturas o paisajes abstractos) para no distraer del texto principal. Mantén archivos bajo 10MB para mejor rendimiento.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
