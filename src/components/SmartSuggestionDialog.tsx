"use client";

import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { suggestWebsite } from "@/ai/flows/suggest-website";
import { useWebsiteData } from "@/contexts/WebsiteDataProvider";
import { Sparkles, Plus, Loader2, Wand2 } from "lucide-react";

export function SmartSuggestionDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [interests, setInterests] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addWebsite } = useWebsiteData();
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    if (!interests.trim()) {
      toast({
        variant: "destructive",
        title: "No interests provided",
        description: "Please tell us what you're interested in.",
      });
      return;
    }
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestWebsite({ userInterests: interests });
      setSuggestions(result.suggestedWebsites);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Suggestion Failed",
        description: "Could not get suggestions at this time. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWebsite = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      const name = hostname.replace(/^www\./, "").split(".")[0];
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      const success = addWebsite(capitalizedName, url);
       if (success) {
        toast({
          title: "Website Added",
          description: `${capitalizedName} has been added to your list.`,
        });
       } else {
         toast({
            variant: "default",
            title: "Already Exists",
            description: `This website is already in your list.`,
          });
       }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "The suggested URL is not valid.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            Smart Suggestions
          </DialogTitle>
          <DialogDescription>
            Describe your interests, and we'll suggest some websites for you to
            track. For example: "I like technology, startups, and cooking."
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Enter your interests here..."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            rows={4}
          />
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {suggestions.length > 0 && !isLoading && (
            <div className="space-y-2">
              <h4 className="font-medium">Here are some suggestions:</h4>
              <ul className="space-y-2">
                {suggestions.map((site, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-2 rounded-md border p-2"
                  >
                    <span className="truncate text-sm">{site}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddWebsite(site)}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleGetSuggestions}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Get Suggestions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
