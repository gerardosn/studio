"use client";

import { useWebsiteData } from "@/contexts/WebsiteDataProvider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Globe, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { AddWebsiteDialog } from "./AddWebsiteDialog";

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

  return (
    <Card
      className="flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={handleAccess}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleAccess()}
      tabIndex={0}
      role="button"
      aria-label={`Open ${name}`}
    >
      <CardHeader className="flex-row items-center space-x-4 pb-2">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <Globe className="h-6 w-6" />
        </div>
        <CardTitle className="text-lg font-medium">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground truncate">{url}</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm font-medium text-muted-foreground">
          Access Count: <span className="text-foreground font-bold">{count}</span>
        </p>
      </CardFooter>
    </Card>
  );
}

export function WebsiteGrid() {
  const { websites, incrementAccessCount, isLoaded } = useWebsiteData();

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex-row items-center space-x-4 pb-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/2" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {websites.map((site) => (
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
