import { Link } from 'react-router-dom';
import { EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

export default function VerifyEmail() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-[#121212]' : 'bg-white'}`}>
      <div className="max-w-md w-full text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <EnvelopeIcon className="h-10 w-10 text-[#3F96FC]" />
        </div>
        
        <h1 className={`text-3xl font-light tracking-tighter mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <span className="font-light">Verifica tu</span> <span className="font-semibold">email</span>
        </h1>
        
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="h-[1px] w-8 bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-1 w-1 rounded-full bg-[#FF854D]"></div>
          <div className="h-[1px] w-8 bg-gray-200 dark:bg-gray-800"></div>
        </div>

        <p className="text-sm opacity-60 font-light leading-relaxed mb-12 px-4">
          Hemos enviado un enlace de confirmación a tu correo electrónico. 
          Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para activar tu cuenta.
        </p>

        <div className="space-y-4">
          <Link
            to="/login"
            className="w-full flex items-center justify-center px-10 py-4 rounded-full bg-[#37383F] text-white text-xs tracking-[0.2em] font-medium hover:bg-[#2a2b30] transition-all"
          >
            IR AL LOGIN
          </Link>
          
          <Link
            to="/"
            className="w-full flex items-center justify-center px-10 py-4 rounded-full border border-gray-100 dark:border-gray-800 text-[10px] tracking-widest uppercase font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all opacity-70"
          >
            VOLVER AL INICIO
          </Link>
        </div>

        <p className="mt-12 text-[10px] tracking-widest uppercase opacity-30">
          ¿No recibiste el correo? <button className="text-[#3F96FC] hover:underline">Reenviar</button>
        </p>
      </div>
    </div>
  );
}
