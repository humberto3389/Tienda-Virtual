const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kuvglujjhogwjrvhuccl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dmdsdWpqaG9nd2pydmh1Y2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjg3NTUsImV4cCI6MjA4ODYwNDc1NX0.bjTiUSzX4_WkLYF29TTnRPJqDKHEPvX_-qLuSiZQ39c';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const servicesToRestore = [
  {
    title: 'Mantenimiento Integral',
    subtitle: 'Computadoras & Laptops',
    description: 'Servicio completo de mantenimiento preventivo y correctivo para maximizar la vida útil de tus equipos.',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3',
    features: [
      'Limpieza profunda interna/externa',
      'Diagnóstico hardware completo',
      'Optimización de rendimiento',
      'Actualización de componentes',
      'Solución de problemas de software'
    ],
    benefits: [
      'Mejora la velocidad del PC',
      'Evita el sobrecalentamiento',
      'Previene fallos inesperados de hardware'
    ],
    price: 'Desde S/ 50.00',
    duration: '2-4 horas',
    category: 'hardware',
    is_featured: true,
    icon_name: 'ComputerDesktopIcon'
  },
  {
    title: 'Asistencia Remota',
    subtitle: 'Soporte Técnico Online',
    description: 'Solución inmediata a tus problemas técnicos sin necesidad de desplazamiento físico.',
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3', // Adjusted using similar from detail
    features: [
      'Soporte en tiempo real',
      'Configuración de software',
      'Resolución de problemas',
      'Optimización de sistemas',
      'Asesoría personalizada'
    ],
    benefits: [
      'Sistemas 100% estables',
      'Licencias sin caídas inesperadas',
      'Cero pantallas azules ni virus de fábrica'
    ],
    price: 'Desde S/ 30.00/hora',
    duration: '1-2 horas',
    category: 'software',
    is_featured: false,
    icon_name: 'WifiIcon'
  },
  {
    title: 'Sistemas de Seguridad',
    subtitle: 'Cámaras & Alarmas',
    description: 'Instalación profesional de sistemas de videovigilancia con monitoreo 24/7.',
    image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3', // Adjusted using similar from detail
    features: [
      'Cámaras HD/4K',
      'Configuración DVR/NVR',
      'Monitoreo remoto',
      'Almacenamiento en la nube',
      'Mantenimiento incluido'
    ],
    benefits: [
      'Internet sin cortes ni bajones',
      'Gran alcance fluido en toda tu casa',
      'Seguridad contra intrusos o vecinos roba-wifi'
    ],
    price: 'Desde S/ 150.00',
    duration: '4-6 horas',
    category: 'seguridad',
    is_featured: true,
    icon_name: 'VideoCameraIcon'
  },
  {
    title: 'Impresoras',
    subtitle: 'Mantenimiento & Reparación',
    description: 'Servicio especializado para impresoras de todas las marcas y modelos.',
    image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d3?ixlib=rb-4.0.3', // Adjusted using similar from detail
    features: [
      'Limpieza de cabezales',
      'Calibración de color',
      'Reparación mecánica',
      'Configuración de red',
      'Mantenimiento preventivo'
    ],
    benefits: [
      'Diagnóstico certero y ágil',
      'Solo usamos repuestos originales',
      'Ahorras al no comprar un equipo nuevo'
    ],
    price: 'Desde S/ 40.00',
    duration: '1-3 horas',
    category: 'perifericos',
    is_featured: false,
    icon_name: 'PrinterIcon'
  },
  {
    title: 'Optimización Avanzada',
    subtitle: 'Acelera tu Equipo',
    description: 'Mejora radical del rendimiento mediante técnicas profesionales de optimización.',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3', // Placeholder
    features: [
      'Análisis de rendimiento',
      'Actualización de drivers',
      'Optimización de memoria',
      'Limpieza profunda',
      'Configuración avanzada'
    ],
    benefits: [
      'Mejora la velocidad del PC',
      'Evita el sobrecalentamiento',
      'Previene fallos inesperados de hardware'
    ],
    price: 'Desde S/ 60.00',
    duration: '2-3 horas',
    category: 'optimizacion',
    is_featured: false,
    icon_name: 'CpuChipIcon'
  },
  {
    title: 'Redes & Conectividad',
    subtitle: 'Cableado Estructurado',
    description: 'Instalación profesional de redes cableadas e inalámbricas para hogares y empresas.',
    image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3',
    features: [
      'Diseño de red',
      'Cableado estructurado',
      'Configuración routers',
      'Optimización WiFi',
      'Seguridad de red'
    ],
    benefits: [
      'Internet sin cortes ni bajones',
      'Gran alcance fluido en toda tu casa',
      'Seguridad contra intrusos o vecinos roba-wifi'
    ],
    price: 'Desde S/ 120.00',
    duration: '3-5 horas',
    category: 'redes',
    is_featured: true,
    icon_name: 'ServerIcon'
  }
];

async function restore() {
  console.log('Restoring original services...');
  
  // First, clear current services to avoid duplicates
  const { error: deleteError } = await supabase
    .from('services')
    .delete()
    .neq('title', ''); // Delete all
    
  if (deleteError) {
    console.error('Error clearing services:', deleteError.message);
    return;
  }

  for (const service of servicesToRestore) {
    const { error } = await supabase
      .from('services')
      .insert([service]);
    
    if (error) {
      console.error(`Error restoring ${service.title}:`, error.message);
    } else {
      console.log(`Restored: ${service.title}`);
    }
  }
  console.log('Done!');
}

restore();
