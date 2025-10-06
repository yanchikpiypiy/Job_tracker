import React, { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        // Initialize from localStorage or default to false (light mode)
        const savedDarkMode = localStorage.getItem('darkMode');
        return savedDarkMode === 'true';
    });

    // Apply theme on mount and when darkMode changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [darkMode]);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const newValue = !prev;
            localStorage.setItem('darkMode', String(newValue));
            return newValue;
        });
    };

    const contextValue = {
        darkMode,
        toggleDarkMode,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}
