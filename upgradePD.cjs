const fs = require('fs');
let content = fs.readFileSync('src/pages/ProductDetail.jsx', 'utf8');

// 1. Right Column wrapper (Make it an elegant sticky card)
content = content.replace(
  '              {/* Información del producto */}\n              <div className="space-y-6">',
  '              {/* Información del producto */}\n              <div className={`space-y-8 lg:sticky lg:top-28 h-fit p-6 sm:p-8 rounded-[2rem] border shadow-2xl ${darkMode ? \'bg-gray-800/60 border-gray-700/50 backdrop-blur-xl\' : \'bg-white border-gray-100\'}`}>\n'
);

// 2. Main background
content = content.replace(
  '<div className={`min-h-screen ${darkMode ? \'bg-[#121212]\' : \'bg-white font-light\'}`}>',
  '<div className={`min-h-screen transition-colors duration-300 ${darkMode ? \'bg-[#0A0A0B] text-white\' : \'bg-[#FAFAFA] text-gray-900\'}`}>'
);

// 3. Image gallery tweaks
content = content.replace(
  '            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-lg">',
  '            <div className="aspect-w-1 aspect-h-1 rounded-[2rem] overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 relative group">'
);

content = content.replace(
  '                  className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${',
  '                  className={`aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden transition-all duration-300 ${'
);
content = content.replace(
  '                      className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${',
  '                      className={`aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden transition-all duration-300 ${'
);

// 4. Buttons redesign (Vertical stacked modern buttons)
content = content.replace(
  /\{\/\* Botones de WhatsApp \*\/\}[\s\S]+?<\/div>\s+<\/div>/,
  `{/* Botones de WhatsApp */}
                <div className="flex flex-col space-y-3 pt-4">
                  <button
                    onClick={handleWhatsAppContact}
                    disabled={product.stock === 0}
                    className="w-full py-4 px-6 rounded-2xl bg-[#3F96FC] hover:bg-[#2e7dda] text-white font-bold text-lg shadow-lg shadow-[#3F96FC]/30 flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none"
                  >
                    {product.stock === 0 ? 'CONSULTAR STOCK' : 'SOLICITAR POR WHATSAPP'}
                  </button>
                  <button
                    onClick={handleWhatsAppInquiry}
                    className={\`w-full py-4 px-6 rounded-2xl border flex items-center justify-center font-medium transition-all \${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}\`}
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    Hacer una consulta rápida
                  </button>
                </div>
              </div>`
);

// 5. Update titles colors just in case
content = content.replace(
  '<h1 className={`text-3xl font-light tracking-tighter mb-4 ${darkMode ? \'text-white\' : \'text-gray-900\'}`}>',
  '<h1 className={`text-4xl lg:text-5xl font-black tracking-tight mb-4 ${darkMode ? \'text-white\' : \'text-gray-900\'}`}>'
);

fs.writeFileSync('src/pages/ProductDetail.jsx', content);
console.log('ProductDetail UI upgraded successfully');
