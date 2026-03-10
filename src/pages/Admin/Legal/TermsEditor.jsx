import React, { useState, useEffect } from 'react';
import { legalService } from '../../../services/legalService';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../config/supabase';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const TermsEditor = () => {
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadTermsContent();
  }, []);

  const loadTermsContent = async () => {
    setLoading(true);
    try {
      const document = await legalService.getLegalDocument('terms');
      if (document) {
        setContent(document.content);
        setLastUpdated(document.updated_at);
      } else {
        // Si no existe, cargar el contenido estático del modal
        const staticContent = await fetchStaticTermsContent();
        setContent(staticContent);
      }
    } catch (err) {
      console.error('Error loading terms content:', err);
      setError('Error al cargar los términos y condiciones');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaticTermsContent = async () => {
    // Aquí extraemos el contenido estático del modal de términos
    // Este es el contenido HTML que se mostrará en el editor
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
          <li>Plazo: 24 horas para verificar</li>
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existingDoc, error: fetchError } = await supabase
        .from('legal_documents')
        .select('id')
        .eq('document_type', 'terms')
        .maybeSingle();
        const now = new Date().toISOString();
  
      if (existingDoc) {
        // ACTUALIZAR documento existente
        const { error: updateError } = await supabase
          .from('legal_documents')
          .update({ 
            content: content,
            updated_at: now
          })
          .eq('id', existingDoc.id);
  
        if (updateError) throw updateError;
        setLastUpdated(now); 
        toast.success('¡Términos actualizados!');
      } else {
        // CREAR nuevo documento si no existe
        const { error: createError } = await supabase
          .from('legal_documents')
          .insert({
            document_type: 'terms',
            title: 'Términos y Condiciones',
            content: content,
            created_at: now,
            updated_at: now,
          });
  
        if (createError) throw createError;
        setLastUpdated(now);
        toast.success('¡Términos creados!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar: ' + error.message);
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
          <h1 className="text-2xl font-bold">Editor de Términos y Condiciones</h1>
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

export default TermsEditor;