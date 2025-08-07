import { ManageWebsites } from "@/components/ManageWebsites";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ManageWebsitesPage() {
  return (
    <div className="w-full space-y-8 mx-auto">
       <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/settings">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to Settings</span>
          </Link>
        </Button>
        <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight">Manage Websites</h1>
            <p className="text-muted-foreground">
            Delete websites you no longer want to track.
            </p>
        </div>
      </div>
      <ManageWebsites />
    </div>
  );
}
