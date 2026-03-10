import React from 'react';
import { 
  CpuChipIcon, 
  CommandLineIcon, 
  SwatchIcon, 
  ScaleIcon, 
  ArrowsPointingOutIcon, 
  HashtagIcon, 
  ShieldCheckIcon, 
  WrenchScrewdriverIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const getSpecIcon = (key = '', value = '') => {
  const combined = `${key} ${value}`.toLowerCase();
  
  if (combined.includes('ram') || combined.includes('memoria') || combined.includes('procesador') || combined.includes('cpu') || combined.includes('almacenamiento') || combined.includes('disco') || combined.includes('ssd') || combined.includes('hdd')) {
    return CpuChipIcon;
  }
  if (combined.includes('sistema') || combined.includes('os') || combined.includes('software') || combined.includes('windows') || combined.includes('mac')) {
    return CommandLineIcon;
  }
  if (combined.includes('color') || combined.includes('diseño') || combined.includes('acabado') || combined.includes('chasis')) {
    return SwatchIcon;
  }
  if (combined.includes('peso') || combined.includes('dimension') || combined.includes('tamaño') || combined.includes('medida') || combined.includes('alto') || combined.includes('ancho')) {
    return ScaleIcon;
  }
  if (combined.includes('pantalla') || combined.includes('pulgada') || combined.includes('resolucion') || combined.includes('display') || combined.includes('monitor') || combined.includes('video') || combined.includes('grafic') || combined.includes('gpu')) {
    return ArrowsPointingOutIcon;
  }
  if (combined.includes('modelo') || combined.includes('serie') || combined.includes('version') || combined.includes('generacion')) {
    return HashtagIcon;
  }
  if (combined.includes('marca') || combined.includes('fabricante') || combined.includes('garantia') || combined.includes('condición') || combined.includes('estado')) {
    return ShieldCheckIcon;
  }
  if (combined.includes('material') || combined.includes('construccion') || combined.includes('puerto') || combined.includes('conexion') || combined.includes('red') || combined.includes('wifi') || combined.includes('bluetooth') || combined.includes('camara') || combined.includes('teclado') || combined.includes('mouse') || combined.includes('bateria') || combined.includes('energia')) {
    return WrenchScrewdriverIcon;
  }
  
  return InformationCircleIcon;
};

const SpecTag = ({ label, value, variant = 'small' }) => {
  if (!value && !label) return null;
  
  const Icon = getSpecIcon(label, value);
  
  if (variant === 'large') {
    return (
      <div className="flex p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="ml-3 flex flex-col">
          <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
            {label}
          </dt>
          <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
            {value}
          </dd>
        </div>
      </div>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
      <Icon className="h-3 w-3 mr-1 opacity-60" />
      {label && <span className="opacity-50 mr-1">{label}:</span>}
      <span className="truncate max-w-[100px]">{value}</span>
    </span>
  );
};

export default SpecTag;
