
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ManageUsersPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/manage-users');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setUsername(data[0].user);
                        setPassword(data[0].Password);
                    }
                } else {
                     toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to fetch user data.",
                    });
                }
            } catch (error) {
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An unexpected error occurred while fetching data.",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await fetch('/api/manage-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: username, Password: password }),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "User credentials updated successfully.",
                });
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.message || "Failed to update user data.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full space-y-8 mx-auto">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-80" />
                    </div>
                </div>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-24" />
                    </CardContent>
                </Card>
            </div>
        )
    }

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
                    <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
                    <p className="text-muted-foreground">
                        Edit the credentials for application access.
                    </p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Administrator Credentials</CardTitle>
                    <CardDescription>
                        Update the username and password for the main administrator account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pr-10"
                                />
                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute inset-y-0 right-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

