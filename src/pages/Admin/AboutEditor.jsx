import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { aboutService } from '../../services/aboutService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AboutEditor = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutId, setAboutId] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await aboutService.getAboutContent();
        if (data) {
          setContent(data.content);
          setAboutId(data.id);
        } else {
          setContent(getStaticContent());
        }
      } catch (error) {
        console.error('Error cargando contenido:', error);
        toast.error('Error al cargar el contenido');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('El contenido no puede estar vacío');
      return;
    }

    setSaving(true);
    try {
      if (aboutId) {
        await aboutService.updateAboutContent(aboutId, { content });
        toast.success('¡Contenido actualizado exitosamente!');
      } else {
        const newContent = await aboutService.createAboutContent({ content });
        setAboutId(newContent.id);
        toast.success('¡Contenido creado exitosamente!');
      }
      
      // Recargar el contenido para asegurarnos que está sincronizado
      const { data } = await aboutService.getAboutContent();
      if (data) {
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Suscripción a cambios en tiempo real
  useEffect(() => {
    const subscription = aboutService.subscribeToChanges((payload) => {
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        setContent(payload.new.content);
        setAboutId(payload.new.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getStaticContent = () => {
    return `
      <div class="min-h-screen bg-gray-50 text-gray-900">
        <div class="container mx-auto px-4 py-12">
          <!-- Sección Principal -->
          <div class="text-center mb-16">
            <h1 class="text-4xl font-bold mb-6 text-gray-900">
              Sobre Nosotros
            </h1>
            <div class="h-1 w-24 mx-auto bg-blue-600 mb-8"></div>
            <p class="text-xl max-w-3xl mx-auto text-gray-600">
              Tu nuevo destino tecnológico: equipos de alta calidad, servicio personalizado y precios competitivos
            </p>
          </div>

          <!-- Nuestra Historia -->
          <div class="rounded-xl overflow-hidden shadow-lg mb-16 bg-white">
            <div class="grid md:grid-cols-2">
              <div class="p-8 lg:p-12 flex items-center">
                <div>
                  <h2 class="text-3xl font-bold mb-6 text-gray-900">Nuestra Historia</h2>
                  <div class="space-y-4 text-gray-600">
                    <p>
                      Nacimos con una visión clara: hacer que la tecnología de alta calidad sea accesible para todos.
                      Fundada en 2025, TechStore surge como respuesta a un mercado que necesitaba un enfoque más
                      personalizado y cercano.
                    </p>
                    <p>
                      Aunque somos nuevos en el mercado, nuestro equipo cuenta con amplia experiencia en el sector
                      tecnológico y una pasión compartida por ofrecer el mejor servicio y los mejores productos.
                    </p>
                  </div>
                </div>
              </div>
              <div class="bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-12">
                <div class="text-white text-center">
                  <h3 class="text-3xl font-bold mb-6">Nuestra Misión</h3>
                  <p class="text-lg">
                    Proporcionar soluciones tecnológicas innovadoras y accesibles, con un servicio excepcional que supere
                    las expectativas de nuestros clientes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Valores -->
          <div class="mb-16">
            <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">
              Nuestros Valores
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div class="rounded-xl p-6 text-center bg-white">
                <div class="flex justify-center">
                  <svg class="h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-3 text-gray-900">
                  Tecnología de Vanguardia
                </h3>
                <p class="text-gray-600">
                  Ofrecemos los equipos más modernos y potentes del mercado
                </p>
              </div>
              <div class="rounded-xl p-6 text-center bg-white">
                <div class="flex justify-center">
                  <svg class="h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-3 text-gray-900">
                  Calidad Garantizada
                </h3>
                <p class="text-gray-600">
                  Todos nuestros productos cuentan con garantía y soporte técnico
                </p>
              </div>
              <div class="rounded-xl p-6 text-center bg-white">
                <div class="flex justify-center">
                  <svg class="h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-3 text-gray-900">
                  Asesoría Personalizada
                </h3>
                <p class="text-gray-600">
                  Te ayudamos a encontrar el equipo perfecto para tus necesidades
                </p>
              </div>
              <div class="rounded-xl p-6 text-center bg-white">
                <div class="flex justify-center">
                  <svg class="h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-3 text-gray-900">
                  Entrega Rápida
                </h3>
                <p class="text-gray-600">
                  Envíos seguros y rápidos a todo el país
                </p>
              </div>
            </div>
          </div>

          <!-- Equipo - Ahora con imágenes reales -->
          <div class="rounded-xl bg-white shadow-lg p-8 mb-16">
            <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">
              Nuestro Equipo
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
              <!-- Miembro 1 -->
              <div class="text-center">
                <div class="w-32 h-32 mx-auto rounded-full mb-6 overflow-hidden border-4 border-blue-100">
                  <img src="/images/team/miguel.jpg" alt="Miguel Torres" class="w-full h-full object-cover">
                </div>
                <h3 class="text-xl font-semibold text-gray-900">Miguel Torres</h3>
                <p class="text-blue-600 mb-3">Fundador & CEO</p>
                <p class="text-gray-600">"Apasionado por la tecnología y con visión de revolucionar el mercado"</p>
              </div>
              
              <!-- Miembro 2 -->
              <div class="text-center">
                <div class="w-32 h-32 mx-auto rounded-full mb-6 overflow-hidden border-4 border-blue-100">
                  <img src="/images/team/laura.jpg" alt="Laura Gómez" class="w-full h-full object-cover">
                </div>
                <h3 class="text-xl font-semibold text-gray-900">Laura Gómez</h3>
                <p class="text-blue-600 mb-3">Especialista en Ventas</p>
                <p class="text-gray-600">"Experta en asesoría técnica y atención al cliente"</p>
              </div>
              
              <!-- Miembro 3 -->
              <div class="text-center">
                <div class="w-32 h-32 mx-auto rounded-full mb-6 overflow-hidden border-4 border-blue-100">
                  <img src="/images/team/carlos.jpg" alt="Carlos Méndez" class="w-full h-full object-cover">
                </div>
                <h3 class="text-xl font-semibold text-gray-900">Carlos Méndez</h3>
                <p class="text-blue-600 mb-3">Director Técnico</p>
                <p class="text-gray-600">"Garantizando la calidad y rendimiento de todos nuestros productos"</p>
              </div>
              
              <!-- Miembro 4 -->
              <div class="text-center">
                <div class="w-32 h-32 mx-auto rounded-full mb-6 overflow-hidden border-4 border-blue-100">
                  <img src="/images/team/ana.jpg" alt="Ana Rodríguez" class="w-full h-full object-cover">
                </div>
                <h3 class="text-xl font-semibold text-gray-900">Ana Rodríguez</h3>
                <p class="text-blue-600 mb-3">Soporte al Cliente</p>
                <p class="text-gray-600">"Comprometida con la satisfacción total de nuestros clientes"</p>
              </div>
            </div>
          </div>

          <!-- Por qué elegirnos -->
          <div class="rounded-xl overflow-hidden shadow-lg mb-16 bg-white">
            <div class="p-8 lg:p-12">
              <h2 class="text-3xl font-bold text-center mb-10 text-gray-900">
                ¿Por qué elegirnos?
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="p-6 rounded-lg bg-blue-50">
                  <h3 class="text-xl font-semibold mb-4 text-gray-900">
                    Atención Personalizada
                  </h3>
                  <p class="text-gray-600">
                    No somos solo vendedores, somos asesores tecnológicos. Analizamos tus necesidades para recomendarte el equipo ideal para ti.
                  </p>
                </div>
                <div class="p-6 rounded-lg bg-blue-50">
                  <h3 class="text-xl font-semibold mb-4 text-gray-900">
                    Productos Seleccionados
                  </h3>
                  <p class="text-gray-600">
                    Cada producto en nuestro catálogo ha sido cuidadosamente seleccionado por su calidad, rendimiento y durabilidad.
                  </p>
                </div>
                <div class="p-6 rounded-lg bg-blue-50">
                  <h3 class="text-xl font-semibold mb-4 text-gray-900">
                    Servicio Post-Venta
                  </h3>
                  <p class="text-gray-600">
                    Nuestro compromiso no termina con la venta. Te ofrecemos soporte técnico y servicio post-venta para resolver cualquier inquietud.
                  </p>
                </div>
                <div class="p-6 rounded-lg bg-blue-50">
                  <h3 class="text-xl font-semibold mb-4 text-gray-900">
                    Precio Justo
                  </h3>
                  <p class="text-gray-600">
                    Ofrecemos la mejor relación calidad-precio del mercado, sin comprometer el rendimiento ni la durabilidad.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="rounded-xl p-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 class="text-3xl font-bold text-white mb-6">
              ¿Buscando la Computadora Perfecta?
            </h2>
            <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Nuestro equipo está listo para asesorarte y encontrar el equipo ideal para tus necesidades y presupuesto
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/shop" class="px-8 py-3 rounded-lg font-medium transition-colors bg-white text-blue-600 hover:bg-gray-100">
                Ver Catálogo
              </a>
              <a href="/contact" class="px-8 py-3 rounded-lg font-medium transition-colors border-2 border-white text-white hover:bg-white hover:bg-opacity-10">
                Contactar Asesor
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" color="gradient" />
        <span className="ml-4 text-gray-600">Cargando editor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Editor de Contenido</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Edita el contenido HTML de la página "Sobre Nosotros" en tiempo real
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Editor HTML</h2>
              <span className="text-xs text-gray-500">{content.length} caracteres</span>
            </div>
            <div className="relative">
              <textarea
                className="w-full h-[70vh] p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={saving}
                spellCheck="false"
              />
              <div className="absolute bottom-3 right-3 bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">
                {content.split('\n').length} líneas
              </div>
            </div>
          </div>

          {/* Vista previa */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Vista Previa</h2>
              <button 
                onClick={() => document.getElementById('preview-content').scrollIntoView({ behavior: 'smooth' })}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Scroll to top
              </button>
            </div>
            <div 
              id="preview-content"
              className="prose prose-blue max-w-none p-6 border border-gray-200 rounded-lg h-[70vh] overflow-auto bg-gray-50"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Consejos de Edición</h2>
        <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside">
          <li>Usa etiquetas HTML estándar para formatear tu contenido</li>
          <li>Puedes incluir clases de Tailwind CSS para estilizar elementos</li>
          <li>La vista previa se actualiza automáticamente mientras escribes</li>
          <li>No olvides guardar los cambios antes de salir</li>
          <li>Para imágenes, usa URLs absolutas o rutas públicas (ej: <code>/images/team/nombre.jpg</code>)</li>
          <li>Las imágenes del equipo deben estar en formato cuadrado para que se vean bien en los círculos</li>
          <li>Tamaño recomendado para fotos de equipo: mínimo 300x300 px</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutEditor;