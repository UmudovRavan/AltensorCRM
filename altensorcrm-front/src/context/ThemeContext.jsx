import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('altensor_theme') || 'dark';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('altensor_theme', newTheme);
  };

  const isDark = theme === 'dark' || theme === 'midnight';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'midnight');
    root.classList.add(theme);
    if (theme === 'midnight') {
      root.classList.add('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
