
"use client";

import React, { createContext, useState, useContext, useMemo, type ReactNode, useEffect } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: keyof (typeof translations)['en'], vars?: Record<string, string>) => string;
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
        
        // Add Website Dialog
        addNewWebsiteTitle: "Add New Website",
        addNewWebsiteDescription: "Enter the details of the website you want to track.",
        websiteUrlLabel: "Website URL",
        displayNameLabel: "Display Name",
        addWebsiteButton: "Add Website",
        
        // Toasts for Add/Edit
        websiteAddedToastTitle: "Website Added",
        websiteAddedToastDescription: "{{name}} has been added to your list.",
        errorAddingWebsiteToastTitle: "Error Adding Website",
        validUrlError: "Please enter a valid URL.",
        
        // Validation Messages
        nameMinLength: "Name must be at least 2 characters.",
        urlMinLength: "URL cannot be empty.",
        
        // Verification Alert
        verificationAlertTitle: "Website Unreachable",
        verificationAlertDescription: "The URL could not be verified. It might be incorrect, or the website might be temporarily down. Do you want to add it anyway?",
        cancelButton: "Cancel",
        addAnywayButton: "Add Anyway",
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
        
        // Add Website Dialog
        addNewWebsiteTitle: "Añadir Nuevo Sitio Web",
        addNewWebsiteDescription: "Introduce los detalles del sitio web que deseas rastrear.",
        websiteUrlLabel: "URL del Sitio Web",
        displayNameLabel: "Nombre a Mostrar",
        addWebsiteButton: "Añadir Sitio Web",
        
        // Toasts for Add/Edit
        websiteAddedToastTitle: "Sitio Web Añadido",
        websiteAddedToastDescription: "{{name}} ha sido añadido a tu lista.",
        errorAddingWebsiteToastTitle: "Error al Añadir el Sitio Web",
        validUrlError: "Por favor, introduce una URL válida.",
        
        // Validation Messages
        nameMinLength: "El nombre debe tener al menos 2 caracteres.",
        urlMinLength: "La URL no puede estar vacía.",

        // Verification Alert
        verificationAlertTitle: "Sitio Web Inaccesible",
        verificationAlertDescription: "La URL no pudo ser verificada. Podría ser incorrecta o el sitio web podría estar temporalmente caído. ¿Deseas añadirlo de todos modos?",
        cancelButton: "Cancelar",
        addAnywayButton: "Añadir de todos modos",
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

    const t = useMemo(() => (key: keyof (typeof translations)['en'], vars?: Record<string, string>): string => {
        let translation = translations[language][key] || translations['en'][key];
        if (vars) {
            Object.keys(vars).forEach(varKey => {
                translation = translation.replace(`{{${varKey}}}`, vars[varKey]);
            });
        }
        return translation;
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
