
"use client";

import { Settings, Trash2, Globe, LogOut, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageProvider";
import type { Language } from "@/contexts/LanguageProvider";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { data: session, status } = useSession();

  return (
    <div className="w-full space-y-8 mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('settingsTitle')}</h1>
        <p className="text-muted-foreground">
          {t('settingsDescription')}
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>{t('appearanceTitle')}</CardTitle>
          <CardDescription>
            {t('appearanceDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="font-medium">{t('toggleTheme')}</span>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('languageTitle')}</CardTitle>
          <CardDescription>
            {t('languageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-2">
                <Label htmlFor="language-select">{t('selectLanguage')}</Label>
                <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                    <SelectTrigger id="language-select">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>{t('dataManagementTitle')}</CardTitle>
            <CardDescription>
                {t('dataManagementDescription')}
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
                <Link href="/settings/manage-websites">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('manageWebsites')}
                </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
                <Link href="/settings/manage-users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                </Link>
            </Button>
             {status === "authenticated" && (
              <Button variant="ghost" className="w-full" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>{t('supportUsTitle')}</CardTitle>
            <CardDescription>
                {t('supportUsDescription')}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <CheckoutButton />
        </CardContent>
      </Card>
    </div>
  );
}
