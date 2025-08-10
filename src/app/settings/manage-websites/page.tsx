
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ManageWebsites } from "@/components/ManageWebsites";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function ProtectedManageWebsites() {
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
            Delete or edit websites you no longer want to track.
            </p>
        </div>
      </div>
      <ManageWebsites />
    </div>
  );
}

export default function ManageWebsitesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login?callbackUrl=/settings/manage-websites');
        }
    }, [status, router]);

    if (status === "loading") {
        return (
             <div className="w-full space-y-8 mx-auto">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-80" />
                    </div>
                </div>
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    if (status === "authenticated") {
        return <ProtectedManageWebsites />;
    }

    return null;
}

