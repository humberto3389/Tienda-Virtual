import React, { useState, useEffect } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { legalService } from '../../services/legalService';
import { supabase } from '../../config/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export const TermsModal = ({ onClose, darkMode }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTermsContent = async () => {
    setLoading(true);
    try {
      const document = await legalService.getLegalDocument('terms');
      if (document && document.content) {
        setContent(document.content);
      } else {
        setContent(getStaticTermsContent());
      }
    } catch (err) {
      console.error('Error fetching terms content:', err);
      setError('Error al cargar los términos y condiciones');
      setContent(getStaticTermsContent());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTermsContent();
    
    const subscription = supabase
      .channel('legal-documents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'legal_documents',
          filter: 'document_type=eq.terms'
        },
        (payload) => {
          if (payload.new && payload.new.content) {
            setContent(payload.new.content);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const getStaticTermsContent = () => {
    return `
      <div class="space-y-6 text-gray-700 dark:text-gray-300">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Bienvenido</h3>
        <p class="mb-6">Bienvenido a los Términos y Condiciones de YERSIMAN SOLUTION. Al acceder y utilizar nuestros servicios, usted acepta cumplir con estos términos y condiciones en su totalidad. Estos términos constituyen un acuerdo legal entre usted, en adelante "USUARIO", y YERSIMAN SOLUTION S.A.C., y a la normativa legal peruana vigente.</p>

        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Requisitos para comprar</h3>
        <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Para realizar compras, el usuario debe:</h4>
        <ul class="list-disc pl-6 mb-6 space-y-2">
          <li>Ser mayor de 18 años</li>
          <li>Proporcionar información personal válida y verificable</li>
          <li>Contar con un método de pago aceptado y válido</li>
          <li>Aceptar estos términos y condiciones</li>
        </ul>

        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Pagos</h3>
        <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Tarjetas aceptadas:</h4>
        <ul class="list-disc pl-6 mb-6 space-y-2">
          <li>Visa, Mastercard, American Express</li>
          <li>Débito y crédito</li>
          <li>Procesamiento seguro PCI DSS</li>
        </ul>
        
        <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Transferencias:</h4>
        <ul class="list-disc pl-6 mb-6 space-y-2">
          <li>Bancos: BCP, Interbank, BBVA</li>
          <li>Plazo: 24 hours para verificar</li>
        </ul>

        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Entregas</h3>
        <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Domicilio:</h4>
        <ul class="list-disc pl-6 mb-6 space-y-2">
          <li>Zonas habilitadas según cobertura</li>
          <li>Costo de envío calculado al ingresar dirección</li>
          <li>Presentar DNI al recibir</li>
          <li>2 intentos de entrega antes de cancelación</li>
        </ul>

        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Políticas Importantes</h3>
        <ul class="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Cancelación de pedidos:</strong> Por indicios de fraude, dirección fuera de cobertura, o datos incorrectos.</li>
          <li><strong>Productos y promociones:</strong> Precios exclusivos para compras online, válidos hasta agotar stock. Imágenes son referenciales.</li>
        </ul>
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
                Términos y Condiciones
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