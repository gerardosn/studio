
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddWebsiteDialog } from "./AddWebsiteDialog";
import { useLanguage } from "@/contexts/LanguageProvider";

export function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t('home'), icon: Home },
    { href: "/stats", label: t('statistics'), icon: BarChart2 },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-[360px] items-center justify-around">
        <nav className="grid w-full grid-cols-4 items-center gap-4 text-center">
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
           <AddWebsiteDialog>
            <button className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
              )}>
              <Plus className="h-6 w-6" />
              <span className="text-xs font-medium">{t('add')}</span>
            </button>
          </AddWebsiteDialog>
          <Link
              href="/settings"
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary",
                pathname === "/settings" && "text-primary"
              )}
            >
              <Settings className="h-6 w-6" />
              <span className="text-xs font-medium">{t('settings')}</span>
            </Link>
        </nav>
      </div>
    </footer>
  );
}
