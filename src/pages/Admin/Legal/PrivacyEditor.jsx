import React, { useState, useEffect } from 'react';
import { legalService } from '../../../services/legalService';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../../context/ThemeContext';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const PrivacyEditor = () => {
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadPrivacyContent();
  }, []);

  const loadPrivacyContent = async () => {
    setLoading(true);
    try {
      const document = await legalService.getLegalDocument('privacy');
      if (document) {
        setContent(document.content);
        setLastUpdated(document.updated_at);
      } else {
        // Si no existe, cargar el contenido estático del modal
        const staticContent = await fetchStaticPrivacyContent();
        setContent(staticContent);
      }
    } catch (err) {
      console.error('Error loading privacy content:', err);
      setError('Error al cargar la política de privacidad');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaticPrivacyContent = async () => {
    // Aquí extraemos el contenido estático del modal de privacidad
    // Este es el contenido HTML que se mostrará en el editor
    return `
      <div class="space-y-6 text-gray-700 dark:text-gray-300">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. POLÍTICA DE PRIVACIDAD</h3>
        <p class="mb-4">En YERSIMAN SOLUTION, respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos la información que usted nos proporciona al utilizar nuestro sitio web y servicios.</p>
        <p class="mb-6">Al acceder y utilizar nuestros servicios, usted acepta las prácticas descritas en esta política. Le recomendamos leer detenidamente este documento para comprender nuestro compromiso con la protección de sus datos y sus derechos.</p>

        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. RECOPILACIÓN DE DATOS</h3>
        <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Datos que recopilamos:</h4>
        <ul class="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Información personal:</strong> Nombre, dirección, correo electrónico, número de teléfono, DNI/RUC.</li>
          <li><strong>Información de pago:</strong> Datos de tarjetas de crédito/débito, información bancaria (procesados de forma segura).</li>
          <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, dispositivo, sistema operativo, páginas visitadas.</li>
          <li><strong>Información de uso:</strong> Historial de compras, productos visualizados, preferencias.</li>
        </ul>

        <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Métodos de recopilación:</h4>
        <ul class="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Directamente de usted:</strong> Al registrarse, realizar compras o contactarnos.</li>
          <li><strong>Automáticamente:</strong> Mediante cookies y tecnologías similares cuando visita nuestro sitio.</li>
          <li><strong>De terceros:</strong> Proveedores de servicios, redes sociales (si conecta su cuenta).</li>
        </ul>

        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. USO DE LA INFORMACIÓN</h3>
        <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Finalidades del tratamiento:</h4>
        <ul class="list-disc pl-6 mb-6 space-y-2">
          <li>Procesar y gestionar sus pedidos y transacciones</li>
          <li>Proporcionar soporte al cliente y responder a sus consultas</li>
          <li>Personalizar su experiencia y mostrarle productos relevantes</li>
          <li>Enviar comunicaciones de marketing (con su consentimiento)</li>
          <li>Mejorar nuestros productos, servicios y sitio web</li>
          <li>Prevenir fraudes y garantizar la seguridad</li>
          <li>Cumplir con obligaciones legales y fiscales</li>
        </ul>

        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. PROTECCIÓN DE DATOS</h3>
        <p class="mb-4">YERSIMAN SOLUTION ha implementado todas las medidas técnicas, legales y organizacionales necesarias para proteger y tratar adecuadamente sus datos personales, evitando accesos no autorizados, alteraciones indebidas, pérdidas accidentales o destrucción de información. Le informamos que su información no será comercializada, transferida ni compartida sin su consentimiento y solo se usará para los fines expresamente señalados en la presente política.</p>

        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. SUS DERECHOS</h3>
        <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Derechos ARCO y otros:</h4>
        <ul class="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Acceso:</strong> Conocer qué datos personales suyos tratamos</li>
          <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
          <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos</li>
          <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
        </ul>
        
        <p class="mb-4">Para ejercer cualquiera de estos derechos, puede contactarnos a través de: <strong>privacidad@yersimansolution.com</strong></p>
      </div>
`;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Verificar si ya existe un documento de privacidad
      const existingDoc = await legalService.getLegalDocument('privacy');
      
      if (existingDoc) {
        // Actualizar documento existente
        await legalService.updateLegalDocument(existingDoc.id, {
          content: content
        });
      } else {
        // Crear nuevo documento
        await legalService.createLegalDocument({
          document_type: 'privacy',
          content: content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      setLastUpdated(new Date().toISOString());
      toast.success('Política de privacidad guardada correctamente');
    } catch (err) {
      console.error('Error saving privacy policy:', err);
      setError('Error al guardar la política de privacidad');
      toast.error('Error al guardar la política de privacidad');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editor de Política de Privacidad</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => window.history.back()}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Última actualización: {formatDate(lastUpdated)}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" color="gradient" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <h2 className="text-xl font-semibold mb-4">Editor</h2>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full h-[600px] p-4 rounded-lg font-mono text-sm ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'} border`}
              />
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <h2 className="text-xl font-semibold mb-4">Vista previa</h2>
              <div 
                className={`w-full h-[600px] p-4 rounded-lg overflow-auto ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'} border`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyEditor;