import { useTheme } from '@/context/ThemeContext';

const PageLayout = ({ children, className = '' }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-white'} ${className}`}>
      <div className="min-h-full">
        {children}
      </div>
    </div>
  );
};

export default PageLayout; 