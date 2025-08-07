"use client";

import { useWebsiteData } from "@/contexts/WebsiteDataProvider";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { AddWebsiteDialog } from "./AddWebsiteDialog";
import Image from "next/image";

function WebsiteCard({
  id,
  name,
  url,
  count,
  onAccess,
}: {
  id: string;
  name: string;
  url: string;
  count: number;
  onAccess: (id: string) => void;
}) {
  const handleAccess = () => {
    onAccess(id);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getFaviconUrl = (pageUrl: string) => {
    try {
      const urlObject = new URL(pageUrl);
      const domain = urlObject.hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (error) {
      console.error("Invalid URL for favicon:", pageUrl);
      return "/"; // Return a fallback or empty path
    }
  };


  return (
    <Card
      className="flex flex-col justify-between h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={handleAccess}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleAccess()}
      tabIndex={0}
      role="button"
      aria-label={`Open ${name}`}
    >
      <CardHeader className="flex-row items-center space-x-4 p-4 pb-2">
        <Image 
            src={getFaviconUrl(url)} 
            alt={`${name} favicon`}
            width={24}
            height={24}
            className="rounded-full"
            unoptimized
            />
        <CardTitle className="text-base font-medium truncate">{name}</CardTitle>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <p className="text-sm font-medium text-muted-foreground">
          Access Count: <span className="text-foreground font-bold">{count}</span>
        </p>
      </CardFooter>
    </Card>
  );
}

export function WebsiteGrid() {
  const { websites, incrementAccessCount, isLoaded } = useWebsiteData();

  const sortedWebsites = [...websites].sort((a, b) => b.count - a.count);

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex-row items-center space-x-4 pb-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-3 w-16" />
              </div>
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-4 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">Your Dashboard is Empty</h2>
        <p className="text-muted-foreground mb-4">
          Add a website to start tracking your stats.
        </p>
        <AddWebsiteDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Website
          </Button>
        </AddWebsiteDialog>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {sortedWebsites.map((site) => (
        <WebsiteCard
          key={site.id}
          id={site.id}
          name={site.name}
          url={site.url}
          count={site.count}
          onAccess={incrementAccessCount}
        />
      ))}
    </div>
  );
}
