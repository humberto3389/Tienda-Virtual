import { useTheme } from '@/context/ThemeContext';

const DarkModeWrapper = ({ 
  children, 
  className = '', 
  lightClassName = '', 
  darkClassName = '',
  as: Component = 'div'
}) => {
  const { darkMode } = useTheme();
  
  const baseClasses = className;
  const themeClasses = darkMode ? darkClassName : lightClassName;
  
  return (
    <Component className={`${baseClasses} ${themeClasses} transition-colors duration-300`}>
      {children}
    </Component>
  );
};

export default DarkModeWrapper; 