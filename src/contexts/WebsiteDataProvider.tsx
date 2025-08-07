
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

interface AddWebsiteResult {
    success: boolean;
    message?: string;
    verificationFailed?: boolean;
}

interface EditWebsiteResult {
    success: boolean;
    message?: string;
    verificationFailed?: boolean;
}

interface WebsiteDataContextType {
  websites: Website[];
  addWebsite: (name: string, url:string, force?: boolean) => Promise<AddWebsiteResult>;
  editWebsite: (id: string, name: string, url: string, force?: boolean) => Promise<EditWebsiteResult>;
  deleteWebsite: (id: string) => Promise<boolean>;
  incrementAccessCount: (id: string) => void;
  isLoaded: boolean;
}

const WebsiteDataContext = createContext<WebsiteDataContextType | undefined>(
  undefined
);

export function WebsiteDataProvider({ children }: { children: ReactNode }) {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWebsites = useCallback(async () => {
    setIsLoaded(false);
    try {
      const response = await fetch('/api/websites-file');
      if (!response.ok) {
        throw new Error('Failed to fetch websites');
      }
      const data = await response.json();
      setWebsites(data);
    } catch (err: any) {
        console.error("Failed to fetch websites:", err);
        setError("Could not load websites. Please try again later.");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchWebsites();
  }, [fetchWebsites]);

  const addWebsite = useCallback(
    async (name: string, url: string, force: boolean = false): Promise<AddWebsiteResult> => {
      try {
        const response = await fetch('/api/websites-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, url, force }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            return { success: false, message: responseData.message, verificationFailed: responseData.verificationFailed };
        }

        setWebsites((prev) => [...prev, responseData]);
        return { success: true };
      } catch (error) {
        console.error("Failed to add website:", error);
        setError("Could not add website. Please try again later.");
        return { success: false, message: 'An unexpected error occurred.' };
      }
    },
    []
  );

  const editWebsite = useCallback(
    async (id: string, name: string, url: string, force: boolean = false): Promise<EditWebsiteResult> => {
      try {
        const response = await fetch(`/api/websites-file?id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, url, force }),
        });
        const responseData = await response.json();
        if (!response.ok) {
          return { success: false, message: responseData.message, verificationFailed: responseData.verificationFailed };
        }
        setWebsites((prev) =>
          prev.map((site) => (site.id === id ? responseData : site))
        );
        return { success: true };
      } catch (error) {
        console.error("Failed to edit website:", error);
        return { success: false, message: "An unexpected error occurred." };
      }
    },
    []
  );

  const deleteWebsite = useCallback(async (id: string) => {
    try {
        const response = await fetch(`/api/websites-file?id=${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete website');
        }

        setWebsites((prev) => prev.filter((site) => site.id !== id));
        return true;
    } catch (error) {
        console.error("Failed to delete website:", error);
        setError("Could not delete website. Please try again later.");
        return false;
    }
  }, []);

  const incrementAccessCount = useCallback((id: string) => {
    setWebsites((prev) =>
      prev.map((site) =>
        site.id === id ? { ...site, count: site.count + 1 } : site
      )
    );
     // Note: This only updates local state. A PUT/PATCH request would be needed for persistence.
  }, []);

  const value = { websites, addWebsite, editWebsite, deleteWebsite, incrementAccessCount, isLoaded };

  return (
    <WebsiteDataContext.Provider value={value}>
      {error && <div className="p-4 text-center text-red-500 bg-red-100">{error}</div>}
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
