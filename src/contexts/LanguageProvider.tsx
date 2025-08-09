
"use client";

import React, { createContext, useState, useContext, useMemo, type ReactNode, useEffect } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: keyof (typeof translations)['en']) => string;
}

const translations = {
    en: {
        home: 'Home',
        statistics: 'Statistics',
        add: 'Add',
        settings: 'Settings',
        settingsTitle: 'Settings',
        settingsDescription: 'Manage your application settings.',
        appearanceTitle: 'Appearance',
        appearanceDescription: 'Customize the look and feel of your application.',
        toggleTheme: 'Toggle Theme',
        languageTitle: 'Language',
        languageDescription: 'Choose your preferred language for the application.',
        selectLanguage: 'Select Language',
        dataManagementTitle: 'Data Management',
        dataManagementDescription: 'Modify your saved websites.',
        manageWebsites: 'Manage Websites',
        supportUsTitle: 'Support Us',
        supportUsDescription: 'If you find this application useful, please consider supporting its development.',
    },
    es: {
        home: 'Inicio',
        statistics: 'Estadísticas',
        add: 'Añadir',
        settings: 'Ajustes',
        settingsTitle: 'Ajustes',
        settingsDescription: 'Gestiona los ajustes de tu aplicación.',
        appearanceTitle: 'Apariencia',
        appearanceDescription: 'Personaliza el aspecto de tu aplicación.',
        toggleTheme: 'Cambiar Tema',
        languageTitle: 'Idioma',
        languageDescription: 'Elige tu idioma preferido para la aplicación.',
        selectLanguage: 'Seleccionar Idioma',
        dataManagementTitle: 'Gestión de Datos',
        dataManagementDescription: 'Modifica tus sitios web guardados.',
        manageWebsites: 'Gestionar Sitios Web',
        supportUsTitle: 'Apóyanos',
        supportUsDescription: 'Si encuentras útil esta aplicación, considera apoyar su desarrollo.',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getLanguageFromStorage = (): Language => {
    if (typeof window === 'undefined') return 'en';
    try {
        const storedLang = window.localStorage.getItem('appLanguage');
        return (storedLang === 'es' || storedLang === 'en') ? storedLang : 'en';
    } catch (error) {
        console.error("Failed to parse language from localStorage", error);
        return 'en';
    }
};

const setLanguageToStorage = (language: Language) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem('appLanguage', language);
    } catch (error) {
        console.error("Failed to save language to localStorage", error);
    }
};


export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        setLanguageState(getLanguageFromStorage());
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageToStorage(lang);
        setLanguageState(lang);
    };

    const t = useMemo(() => (key: keyof (typeof translations)['en']): string => {
        return translations[language][key] || translations['en'][key];
    }, [language]);

    const value = { language, setLanguage, t };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
