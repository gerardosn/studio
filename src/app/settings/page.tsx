
import { Settings, Trash2, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="w-full space-y-8 mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="font-medium">Toggle Theme</span>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>
            Choose your preferred language for the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-2">
                <Label htmlFor="language-select">Select Language</Label>
                <Select defaultValue="en">
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
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
                Modify your saved websites.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Link href="/settings/manage-websites" passHref>
                <Button variant="outline" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Manage Websites
                </Button>
            </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Support Us</CardTitle>
            <CardDescription>
                If you find this application useful, please consider supporting its development.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <CheckoutButton />
        </CardContent>
      </Card>
    </div>
  );
}
