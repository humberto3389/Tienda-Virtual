import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { serviceService } from '../../services/serviceService';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/auth/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const { profile } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    price: '',
    duration: '',
    category: '',
    is_featured: false,
    features: [],
    benefits: [],
    icon_name: 'WrenchScrewdriverIcon'
  });

  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const result = await serviceService.getServices();
      if (result.success) {
        setServices(result.data);
      } else {
        toast.error('Error al cargar servicios: ' + result.error);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title || '',
        subtitle: service.subtitle || '',
        description: service.description || '',
        image_url: service.image_url || '',
        price: service.price || '',
        duration: service.duration || '',
        category: service.category || '',
        is_featured: service.is_featured || false,
        features: service.features || [],
        benefits: service.benefits || [],
        icon_name: service.icon_name || 'WrenchScrewdriverIcon'
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image_url: '',
        price: '',
        duration: '',
        category: '',
        is_featured: false,
        features: [],
        benefits: [],
        icon_name: 'WrenchScrewdriverIcon'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      // Usamos el nuevo método optimizado para servicios
      const imageUrl = await storageService.uploadServiceImage(file, 'medium');
      
      if (imageUrl) {
        setFormData(prev => ({ ...prev, image_url: imageUrl }));
        toast.success('Imagen subida correctamente');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir imagen: ' + (error.message || 'Error desconocido'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let result;
      if (editingService) {
        result = await serviceService.updateService(editingService.id, formData);
      } else {
        result = await serviceService.createService(formData);
      }

      if (result.success) {
        toast.success(editingService ? 'Servicio actualizado' : 'Servicio creado');
        handleCloseModal();
        loadServices();
      } else {
        toast.error('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Ocurrió un error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) return;
    
    try {
      setLoading(true);
      const result = await serviceService.deleteService(id);
      if (result.success) {
        toast.success('Servicio eliminado');
        loadServices();
      } else {
        toast.error('Error al eliminar: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  if (!profile?.role?.includes('admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-bold">No tienes permisos para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 md:p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-2"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Volver al Dashboard
            </button>
            <h1 className="text-3xl font-bold">Gestión de <span className="text-indigo-600">Servicios</span></h1>
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all font-medium"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nuevo Servicio
          </button>
        </div>

        {loading && services.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" color="gradient" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                  <img 
                    src={service.image_url || 'https://via.placeholder.com/400x200'} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  {service.is_featured && (
                    <span className="absolute top-2 right-2 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">
                      Destacado
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-1 truncate">{service.title}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-3">{service.subtitle}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{service.description}</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="font-bold text-lg">{service.price}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {services.length === 0 && !loading && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No hay servicios registrados. ¡Crea el primero!</p>
          </div>
        )}
      </div>

      {/* Modal de Formulario */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-2xl my-8 rounded-3xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold">
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Título del Servicio*</label>
                  <input 
                    type="text" 
                    required
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Subtítulo (ej. Hardware/Software)</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Descripción*</label>
                <textarea 
                  required
                  rows="3"
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Precio (ej. Desde S/ 50.00)</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Duración Estimada</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Icono (Heroicon Name)</label>
                  <select 
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                    value={formData.icon_name}
                    onChange={(e) => setFormData({...formData, icon_name: e.target.value})}
                  >
                    <option value="WrenchScrewdriverIcon">Llave/Destornillador</option>
                    <option value="ComputerDesktopIcon">Monitor/PC</option>
                    <option value="CpuChipIcon">Procesador/Chip</option>
                    <option value="WifiIcon">Antena/WiFi</option>
                    <option value="ShieldCheckIcon">Escudo/Seguridad</option>
                    <option value="VideoCameraIcon">Cámara/Vigilancia</option>
                    <option value="PrinterIcon">Impresora</option>
                    <option value="ServerIcon">Servidor/Nube</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Categoría</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="ej. hardware, software, seguridad"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="is_featured"
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Marcar como servicio popular/destacado
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Imagen del Servicio</label>
                <div className="flex items-center gap-4">
                  <div className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="relative cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span>{uploadingImage ? 'Subiendo...' : 'Cambiar imagen'}</span>
                      <input type="file" className="sr-only" onChange={handleImageUpload} disabled={uploadingImage} accept="image/*" />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, WebP hasta 5MB</p>
                  </div>
                </div>
              </div>

              {/* Gestión de Características */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Lo que incluye el servicio</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nueva característica..."
                    className={`flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button 
                    type="button"
                    onClick={addFeature}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <PlusIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                      {feature}
                      <button type="button" onClick={() => removeFeature(index)} className="ml-1.5 focus:outline-none">
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Gestión de Beneficios */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Beneficios Directos</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nuevo beneficio..."
                    className={`flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  />
                  <button 
                    type="button"
                    onClick={addBenefit}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <PlusIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                      <button type="button" onClick={() => removeBenefit(index)} className="text-red-500 hover:text-red-700">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50 transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading ? 'Guardando...' : editingService ? 'Actualizar Servicio' : 'Crear Servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
