"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import type { Website } from "@/lib/types";
import { initialWebsites } from "@/lib/fakeDB";

interface WebsiteDataContextType {
  websites: Website[];
  addWebsite: (name: string, url:string) => boolean;
  incrementAccessCount: (id: string) => void;
  isLoaded: boolean;
}

const WebsiteDataContext = createContext<WebsiteDataContextType | undefined>(
  undefined
);

export function WebsiteDataProvider({ children }: { children: ReactNode }) {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedWebsites = localStorage.getItem("websites");
      if (storedWebsites) {
        setWebsites(JSON.parse(storedWebsites));
      } else {
        setWebsites(initialWebsites);
      }
    } catch (error) {
      console.error("Failed to load websites from localStorage", error);
      setWebsites(initialWebsites);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("websites", JSON.stringify(websites));
      } catch (error) {
        console.error("Failed to save websites to localStorage", error);
      }
    }
  }, [websites, isLoaded]);

  const addWebsite = useCallback(
    (name: string, url: string) => {
      const newWebsite: Website = {
        id: crypto.randomUUID(),
        name,
        url,
        count: 0,
      };
      // prevent duplicates
      if (websites.some(site => site.url === url)) {
        return false;
      }
      setWebsites((prev) => [...prev, newWebsite]);
      return true;
    },
    [websites]
  );

  const incrementAccessCount = useCallback((id: string) => {
    setWebsites((prev) =>
      prev.map((site) =>
        site.id === id ? { ...site, count: site.count + 1 } : site
      )
    );
  }, []);

  const value = { websites, addWebsite, incrementAccessCount, isLoaded };

  return (
    <WebsiteDataContext.Provider value={value}>
      {children}
    </WebsiteDataContext.Provider>
  );
}

export function useWebsiteData() {
  const context = useContext(WebsiteDataContext);
  if (context === undefined) {
    throw new Error("useWebsiteData must be used within a WebsiteDataProvider");
  }
  return context;
}
