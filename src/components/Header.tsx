import Link from "next/link";
import { BarChart2, Globe, Sparkles, Plus } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { AddWebsiteDialog } from "./AddWebsiteDialog";
import { SmartSuggestionDialog } from "./SmartSuggestionDialog";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Globe className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              WebStats Central
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Home
            </Link>
            <Link
              href="/stats"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Statistics
            </Link>
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Globe className="h-6 w-6" />
          </Link>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
          <AddWebsiteDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </AddWebsiteDialog>
          <SmartSuggestionDialog>
            <Button variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Suggest
            </Button>
          </SmartSuggestionDialog>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
