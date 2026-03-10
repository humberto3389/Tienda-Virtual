import { useState, useEffect } from 'react';
import { contactService } from '../../services/contactService';
import {
  Cog6ToothIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  GlobeAltIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const ContactAdmin = () => {
  const [contactConfig, setContactConfig] = useState({
    email: { value: '', description: '' },
    phone: { value: '', description: '' },
    location: { value: '', description: '' },
    hours: { value: '', description: '' },
    map_url: { value: '', description: '' }
  });
  
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const { data: contactInfo } = await contactService.getContactInfo();
      const contactMap = contactInfo.reduce((acc, item) => ({
        ...acc,
        [item.type]: { value: item.value, description: item.description }
      }), {});
      setContactConfig(contactMap);

      const { data: faqsData } = await contactService.getFAQs();
      setFaqs(faqsData);

      // Obtener mensajes no leídos
      const { data: messagesData } = await contactService.getMessages('unread');
      if (messagesData && Array.isArray(messagesData)) {
        setMessages(messagesData);
        console.log('Mensajes no leídos cargados:', messagesData.length);
      } else {
        console.error('No se pudieron cargar los mensajes correctamente');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessages([]);
    }
  };

  const handleConfigChange = (type, field, value) => {
    setContactConfig(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const saveContactConfig = async () => {
    try {
      // Crear un array de promesas para todas las actualizaciones
      const updatePromises = Object.entries(contactConfig).map(([type, data]) => {
        console.log(`Guardando configuración para ${type}:`, data);
        return contactService.upsertContactInfo(type, data);
      });
      
      // Esperar a que todas las promesas se resuelvan
      const results = await Promise.all(updatePromises);
      
      // Verificar si hubo algún error
      const hasErrors = results.some(result => result.error);
      
      if (hasErrors) {
        console.error('Algunos datos no se guardaron correctamente:', results);
        alert('Algunos datos no se guardaron correctamente. Revisa la consola para más detalles.');
      } else {
        console.log('Todos los datos se guardaron correctamente');
        alert('Configuración guardada con éxito ✅');
        
        // Recargar los datos para asegurar que se muestran los valores actualizados
        loadAllData();
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error al guardar ⚠️');
    }
  };


  const handleFaq = async (action, faq = null) => {
    try {
      if (action === 'create') {
        await contactService.addFAQ(newFaq);
        setNewFaq({ question: '', answer: '' });
      } else if (action === 'update') {
        await contactService.updateFAQ(faq.id, faq);
      } else if (action === 'delete') {
        await contactService.deleteFAQ(faq.id);
      }
      
      const { data } = await contactService.getFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('FAQ error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            <Cog6ToothIcon className="h-8 w-8 inline-block mr-3 text-blue-500" />
            Panel de Contacto
          </h1>
          <button
            onClick={saveContactConfig}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all"
          >
            <CheckIcon className="h-5 w-5 inline-block mr-2" />
            Guardar Todo
          </button>
        </div>

        {/* Sección de Contacto */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold mb-6 dark:text-white flex items-center">
            <BookmarkIcon className="h-6 w-6 mr-2 text-purple-500" />
            Información de Contacto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { type: 'email', icon: EnvelopeIcon, label: 'Email' },
              { type: 'phone', icon: PhoneIcon, label: 'Teléfono' },
              { type: 'location', icon: MapPinIcon, label: 'Ubicación' },
              { type: 'hours', icon: ClockIcon, label: 'Horario' },
              { type: 'map_url', icon: GlobeAltIcon, label: 'Mapa', fullWidth: true },
            ].map(({ type, icon: Icon, label, fullWidth }) => (
              <div key={type} className={`space-y-4 ${fullWidth ? 'col-span-full' : ''}`}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Icon className="h-5 w-5 mr-2 text-blue-400" />
                  {label}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Valor principal"
                  value={contactConfig[type]?.value || ''}
                  onChange={(e) => handleConfigChange(type, 'value', e.target.value)}
                />
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción"
                  value={contactConfig[type]?.description || ''}
                  onChange={(e) => handleConfigChange(type, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sección de FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold mb-6 dark:text-white flex items-center">
            <ChatBubbleLeftIcon className="h-6 w-6 mr-2 text-green-500" />
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <input
                type="text"
                placeholder="Nueva pregunta"
                className="w-full px-4 py-3 mb-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-600"
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              />
              <textarea
                placeholder="Respuesta"
                className="w-full px-4 py-3 mb-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-600"
                rows="3"
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              />
              <button
                onClick={() => handleFaq('create')}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Agregar FAQ
              </button>
            </div>

            {faqs.map(faq => (
              <div key={faq.id} className="group bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-md transition-shadow">
                <input
                  type="text"
                  className="w-full px-4 py-3 mb-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-600 font-medium"
                  value={faq.question}
                  onChange={(e) => handleFaq('update', { ...faq, question: e.target.value })}
                />
                <textarea
                  className="w-full px-4 py-3 mb-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-600"
                  rows="3"
                  value={faq.answer}
                  onChange={(e) => handleFaq('update', { ...faq, answer: e.target.value })}
                />
                <button
                  onClick={() => handleFaq('delete', faq)}
                  className="text-red-500 hover:text-red-600 flex items-center text-sm"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Eliminar Pregunta
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Mensajes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold mb-6 dark:text-white flex items-center">
            <EnvelopeIcon className="h-6 w-6 mr-2 text-purple-500" />
            Mensajes Recibidos ({messages.length})
          </h2>
          
          <div className="space-y-4">
            {messages.map(message => (
              <div key={message.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold dark:text-white flex items-center">
                      <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
                      {message.name}
                    </h3>
                    <p className="text-blue-500 dark:text-blue-400 text-sm mt-1">{message.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={async () => {
                        await contactService.markMessageAsRead(message.id);
                        loadAllData(); // Recargar datos
                      }}
                      className="text-green-500 hover:text-green-600 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Marcar como leído"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={async () => {
                        if (confirm('¿Estás seguro de eliminar este mensaje?')) {
                          await contactService.deleteMessage(message.id);
                          loadAllData(); // Recargar datos
                        }
                      }}
                      className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Eliminar mensaje"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Asunto: {message.subject}</p>
                  <p className="text-gray-700 dark:text-gray-300">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;