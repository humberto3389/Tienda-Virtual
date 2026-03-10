const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kuvglujjhogwjrvhuccl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dmdsdWpqaG9nd2pydmh1Y2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjg3NTUsImV4cCI6MjA4ODYwNDc1NX0.bjTiUSzX4_WkLYF29TTnRPJqDKHEPvX_-qLuSiZQ39c';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const servicesToSeed = [
  {
    title: "Mantenimiento de Equipos",
    subtitle: "Computadoras & Laptops",
    description: "Servicio completo de mantenimiento preventivo y correctivo para tus equipos informáticos, garantizando un rendimiento óptimo y alargando su vida útil.",
    image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3",
    price: "Desde S/ 50.00",
    features: [
      "Limpieza interna y externa integral",
      "Cambio de pasta térmica de alta calidad",
      "Optimización de sistema operativo (.NET, Registro)",
      "Eliminación de virus, troyanos y malware",
      "Actualización de drivers principales"
    ],
    benefits: ["Mejora la velocidad del PC", "Evita el sobrecalentamiento", "Previene fallos inesperados de hardware"],
    icon_name: "WrenchScrewdriverIcon",
    category: "hardware",
    is_featured: true,
    duration: "2-4 horas"
  },
  {
    title: "Reparación de Hardware",
    subtitle: "Diagnóstico & Solución",
    description: "Diagnóstico preciso y reparación de componentes dañados para laptops y computadoras de escritorio. Revivimos tus dispositivos al instante.",
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d3?ixlib=rb-4.0.3",
    price: "Desde S/ 30.00",
    features: [
      "Diagnóstico electrónico profundo de placa base",
      "Reemplazo de pantallas, teclados o baterías",
      "Soldadura de componentes y conectores de carga",
      "Repotenciación a discos SSD y memoria RAM",
      "Medición de voltajes de fuente de poder"
    ],
    benefits: ["Diagnóstico certero y ágil", "Solo usamos repuestos originales", "Ahorras al no comprar un equipo nuevo"],
    icon_name: "CpuChipIcon",
    category: "hardware",
    is_featured: false,
    duration: "1-3 horas"
  },
  {
    title: "Instalación de Software",
    subtitle: "Sistemas & Aplicaciones",
    description: "Instalación, configuración y licenciamiento de sistemas operativos y software especializado para estudiantes, hogar o empresas.",
    image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3",
    price: "Desde S/ 25.00",
    features: [
      "Formateo total sin pérdida de datos (Backup)",
      "Instalación de Windows 10/11 Pro Activado",
      "Instalar Office completo (Word, Excel, PowerPoint)",
      "Configuración de software especializado (AutoCAD, Adobe, etc)",
      "Antivirus Premium activado por 1 año"
    ],
    benefits: ["Sistemas 100% estables", "Licencias sin caídas inesperadas", "Cero pantallas azules ni virus de fábrica"],
    icon_name: "ShieldCheckIcon",
    category: "software",
    is_featured: false,
    duration: "1-2 horas"
  },
  {
    title: "Redes y Conectividad",
    subtitle: "WiFi & Cableado",
    description: "Diseño, configuración y mantenimiento de redes locales (LAN/Wi-Fi) y soluciones de conectividad para asegurar un internet ininterrumpido.",
    image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3",
    price: "Desde S/ 40.00",
    features: [
      "Ampliación de señal Wi-Fi por zonas muertas",
      "Cableado estructurado de red UTP Categoría 6",
      "Configuración de routers, modems y switches",
      "Muros de Seguridad de red (Firewall)",
      "Compartición de impresoras en red local"
    ],
    benefits: ["Internet sin cortes ni bajones", "Gran alcance fluido en toda tu casa", "Seguridad contra intrusos o vecinos roba-wifi"],
    icon_name: "WifiIcon",
    category: "redes",
    is_featured: true,
    duration: "2-5 horas"
  }
];

async function seed() {
  console.log('Seeding services...');
  for (const service of servicesToSeed) {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select();
    
    if (error) {
      console.error(`Error seeding ${service.title}:`, error.message);
    } else {
      console.log(`Seeded: ${service.title}`);
    }
  }
  console.log('Done!');
}

seed();
