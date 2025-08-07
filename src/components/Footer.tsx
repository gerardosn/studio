"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Settings, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddWebsiteDialog } from "./AddWebsiteDialog";
import { SmartSuggestionDialog } from "./SmartSuggestionDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/stats", label: "Statistics", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-[360px] items-center justify-around">
        <nav className="grid w-full grid-cols-3 items-center gap-4 text-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary",
                pathname === item.href && "text-primary"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
