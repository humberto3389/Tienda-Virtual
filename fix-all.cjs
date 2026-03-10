const fs = require('fs');

const cleanPrivacyHtml = `
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

const cleanTermsHtml = `
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

let edPrivacy = fs.readFileSync('src/pages/Admin/Legal/PrivacyEditor.jsx', 'utf8');
edPrivacy = edPrivacy.replace(/return `(?:[\s\S]+?)`;/, 'return `'+cleanPrivacyHtml+'`;');
fs.writeFileSync('src/pages/Admin/Legal/PrivacyEditor.jsx', edPrivacy);

let edTerms = fs.readFileSync('src/pages/Admin/Legal/TermsEditor.jsx', 'utf8');
edTerms = edTerms.replace(/return `(?:[\s\S]+?)`;/, 'return `'+cleanTermsHtml+'`;');
fs.writeFileSync('src/pages/Admin/Legal/TermsEditor.jsx', edTerms);
console.log('SUCCESS');
