import { useState, useEffect } from 'react';
import { contactService } from '../services/contactService';
import { useAuth } from '../context/auth/AuthContext';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contactData, setContactData] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      if (user && profile) {
        setFormData(prev => ({
          ...prev,
          name: profile.nombre && profile.apellido ? `${profile.nombre} ${profile.apellido}` : profile.nombre || '',
          email: user.email || ''
        }));
        
        try {
          const lastMessage = await contactService.getUserLastMessage(user.email);
          if (lastMessage) {
            setFormData(prev => ({
              ...prev,
              subject: lastMessage.subject || prev.subject,
              message: ''
            }));
          }
        } catch (error) {
          console.error('Error al cargar el último mensaje:', error);
        }
      }
    };
    loadUserData();
  }, [user, profile]);

  useEffect(() => {
    const loadData = async () => {
      const { data: contactInfo } = await contactService.getContactInfo();
      const { data: faqsData } = await contactService.getFAQs();
      
      const contactMap = contactInfo.reduce((acc, item) => {
        acc[item.type] = item.value;
        return acc;
      }, {});
      
      setContactData(contactMap);
      setFaqs(faqsData);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadMapUrl = async () => {
      const url = await contactService.getContactMap();
      setMapUrl(url);
    };
    loadMapUrl();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await contactService.submitContactMessage(formData);
      if (error) throw error;
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
      {/* Hero Section */}
      <div className="border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6 text-black dark:text-white">
              Contacto <span className="font-semibold">Directo.</span>
            </h1>
            <p className="max-w-xl mx-auto text-lg text-gray-500 font-light tracking-wide leading-relaxed">
              Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Grid */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Email */}
          <div className="bg-[#F5F5F7] dark:bg-[#111] rounded-[2rem] p-8 hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-white dark:bg-black text-[#00E5FF]">
                <EnvelopeIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-1">Email</h3>
                <p className="text-sm font-light text-black dark:text-white">
                  {contactData.email || 'info@yersiman.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-[#F5F5F7] dark:bg-[#111] rounded-[2rem] p-8 hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-white dark:bg-black text-[#00E5FF]">
                <PhoneIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-1">Teléfono</h3>
                <p className="text-sm font-light text-black dark:text-white">
                  {contactData.phone || '+34 123 456 789'}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-[#F5F5F7] dark:bg-[#111] rounded-[2rem] p-8 hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-white dark:bg-black text-[#00E5FF]">
                <MapPinIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-1">Ubicación</h3>
                <p className="text-sm font-light text-black dark:text-white">
                  {contactData.location || 'Madrid, España'}
                </p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-[#F5F5F7] dark:bg-[#111] rounded-[2rem] p-8 hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-white dark:bg-black text-[#00E5FF]">
                <ClockIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-1">Horario</h3>
                <p className="text-sm font-light text-black dark:text-white">
                  {contactData.hours || 'Lun-Vie: 9:00-18:00'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="p-10 lg:p-14 rounded-[2.5rem] bg-[#F5F5F7] dark:bg-[#111]">
            <div className="flex items-center space-x-4 mb-10">
              <div className="p-3 rounded-full bg-white dark:bg-black text-[#00E5FF]">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-light tracking-tighter text-black dark:text-white">Envíanos un mensaje</h2>
            </div>

            {!user ? (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-8 text-center border border-indigo-100 dark:border-indigo-900/30">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                  <ShieldCheckIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium text-indigo-900 dark:text-indigo-200 mb-2">
                  Acceso Requerido
                </h3>
                <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                  Para enviar mensajes necesitas tener una cuenta registrada
                </p>
                <div className="mt-6">
                  <a
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                  >
                    Iniciar Sesión
                  </a>
                  <p className="mt-4 text-sm text-indigo-700 dark:text-indigo-300">
                    ¿No tienes cuenta?{' '}
                    <a href="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      Regístrate aquí
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <>
                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircleIcon className="h-5 w-5" />
                      <p>¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-medium tracking-widest uppercase opacity-50 mb-2">Nombre</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 rounded-full bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 text-sm font-light text-gray-900 dark:text-white focus:border-[#00E5FF] outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium tracking-widest uppercase opacity-50 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 rounded-full bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 text-sm font-light text-gray-900 dark:text-white focus:border-[#00E5FF] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase opacity-50 mb-2">Asunto</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 rounded-full bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 text-sm font-light text-gray-900 dark:text-white focus:border-[#00E5FF] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium tracking-widest uppercase opacity-50 mb-2">Mensaje</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 text-sm font-light text-gray-900 dark:text-white focus:border-[#00E5FF] outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center px-10 py-4 rounded-full bg-[#37383F] text-white text-xs tracking-[0.2em] font-medium hover:bg-[#2a2b30] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Map and FAQ Section */}
          <div className="space-y-8">
            {/* Map */}
            <div className="rounded-[2.5rem] overflow-hidden bg-[#F5F5F7] dark:bg-[#111] p-4">
              <div className="rounded-[2rem] overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d345.16491201282525!2d-72.69499679023498!3d-12.882904768184062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e1!3m2!1ses-419!2spe!4v1747105295603!5m2!1ses-419!2spe"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="dark:grayscale opacity-90 hover:opacity-100 transition-opacity duration-500"
                ></iframe>
              </div>
            </div>

            {/* FAQ Section Mejorada */}
            <div className="bg-[#F5F5F7] dark:bg-[#111] rounded-[2.5rem] p-10 lg:p-14">
              <div className="mb-10">
                <h2 className="text-3xl font-light tracking-tighter text-black dark:text-white">
                  Preguntas Frecuentes.
                </h2>
                <p className="mt-2 text-sm text-gray-500 font-light tracking-wide">
                  Respuestas a las consultas más comunes
                </p>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div 
                    key={faq.id}
                    className="group relative overflow-hidden rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    <div className="flex items-start p-6 space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-sm font-medium tracking-wide text-black dark:text-white flex items-center justify-between">
                          {faq.question}
                          <ChevronDownIcon className="h-4 w-4 text-gray-400 transform group-hover:rotate-180 transition-transform duration-300" />
                        </h3>
                        <div className="mt-3">
                          <p className="text-sm font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;