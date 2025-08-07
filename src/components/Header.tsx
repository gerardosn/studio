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
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-280q-33 0-56.5-23.5T200-360v-400q0-33 23.5-56.5T280-840h560q33 0 56.5 23.5T920-760v400q0 33-23.5 56.5T840-280H280Zm0-200v120h560v-120H698q-21 36-57 58t-81 22q-45 0-81-22t-57-58H280Zm280 0q33 0 56.5-23.5T640-560h200v-200H280v200h200q0 33 23.5 56.5T560-480Zm200 360H120q-33 0-56.5-23.5T40-200v-480h80v480h640v80ZM280-360h560-560Z"/></svg>
            <span className="hidden font-bold sm:inline-block">
              webDirectory
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
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-280q-33 0-56.5-23.5T200-360v-400q0-33 23.5-56.5T280-840h560q33 0 56.5 23.5T920-760v400q0 33-23.5 56.5T840-280H280Zm0-200v120h560v-120H698q-21 36-57 58t-81 22q-45 0-81-22t-57-58H280Zm280 0q33 0 56.5-23.5T640-560h200v-200H280v200h200q0 33 23.5 56.5T560-480Zm200 360H120q-33 0-56.5-23.5T40-200v-480h80v480h640v80ZM280-360h560-560Z"/></svg>
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
