"use client";

import { useWebsiteData } from "@/contexts/WebsiteDataProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { DeleteWebsiteDialog } from "./DeleteWebsiteDialog";
import { EditWebsiteDialog } from "./EditWebsiteDialog";

export function ManageWebsites() {
  const { websites, isLoaded } = useWebsiteData();

  if (!isLoaded) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">No Websites to Manage</h2>
        <p className="text-muted-foreground">
          You haven't added any websites yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Website</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {websites.map((site) => (
            <TableRow key={site.id}>
              <TableCell className="font-medium">{site.name}</TableCell>
              <TableCell className="text-right space-x-2">
                 <EditWebsiteDialog website={site}>
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                </EditWebsiteDialog>
                <DeleteWebsiteDialog website={site}>
                    <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </DeleteWebsiteDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


