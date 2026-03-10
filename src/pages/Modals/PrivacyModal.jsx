import React, { useState, useEffect } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { legalService } from '../../services/legalService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export const PrivacyModal = ({ onClose, darkMode }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrivacyContent = async () => {
      try {
        const document = await legalService.getLegalDocument('privacy');
        if (document && document.content) {
          setContent(document.content);
        } else {
          setContent(getStaticPrivacyContent());
        }
      } catch (err) {
        console.error('Error fetching privacy content:', err);
        setError('Error al cargar la política de privacidad');
        setContent(getStaticPrivacyContent());
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyContent();
  }, []);

  const getStaticPrivacyContent = () => {
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

  const processContent = (html) => {
    if (!html) return '';
    return html.replace(/bg-gradient-to-[a-z]+|from-[a-z]+-\d+|to-[a-z]+-\d+|via-[a-z]+-\d+|bg-white\/[0-9]+|shadow-[a-z]+|backdrop-blur-[a-z]+|border-gray-200\/40|border-white/g, ' ');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Política de Privacidad
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                {error}
              </div>
            ) : (
              <div 
                className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: processContent(content) }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
