// src/context/DarkModeContext.jsx
import { createContext, useContext, useEffect } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  // Force dark mode only - no toggle functionality
  const darkMode = true;
  const setDarkMode = () => {}; // Disabled function

  useEffect(() => {
    // Always set dark mode
    localStorage.setItem('darkMode', 'true');
    document.documentElement.classList.add('dark'); // Always add dark class
  }, []);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
