'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, Globe, Shield, Bell, Database, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Settings Saved",
                description: "System configuration has been updated successfully.",
            });
        }, 1000);
    };

    return (
        <div className="space-y-8 w-full max-w-7xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground">Manage global configuration and system preferences.</p>
                </div>
                <Button onClick={handleSave} disabled={loading} className="gap-2 shadow-md">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="bg-white/50 backdrop-blur-sm border shadow-sm">
                    <TabsTrigger value="general" className="gap-2"><Globe className="h-4 w-4" /> General</TabsTrigger>
                    <TabsTrigger value="security" className="gap-2"><Shield className="h-4 w-4" /> Security</TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
                    <TabsTrigger value="database" className="gap-2"><Database className="h-4 w-4" /> System</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>General Configuration</CardTitle>
                            <CardDescription>Basic site information and regional settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="site-name">Portal Name</Label>
                                    <Input id="site-name" defaultValue="KASUPDA Main Portal" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="support-email">Support Email</Label>
                                    <Input id="support-email" defaultValue="support@kasupda.kaduna.gov.ng" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="site-description">Site Description</Label>
                                <Input id="site-description" defaultValue="Kaduna State Urban Planning and Development Authority Digital Services Portal" />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">Disable public access to the portal for maintenance.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage authentication and access control policies.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Require 2FA for all administrative accounts.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                                <div className="space-y-0.5">
                                    <Label className="text-base">New User Registration</Label>
                                    <p className="text-sm text-muted-foreground">Allow new applicants to create accounts.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="session-timeout">Session Timeout (Minutes)</Label>
                                <Input id="session-timeout" type="number" defaultValue="60" className="max-w-[200px]" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Configure system-wide email and SMS alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Send automated emails for application status updates.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                                <div className="space-y-0.5">
                                    <Label className="text-base">SMS Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Send SMS notifications for urgent payment reminders.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="database">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>System Information</CardTitle>
                            <CardDescription>View system status and performance metrics.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="p-4 border rounded-lg bg-slate-50/50 text-center">
                                    <p className="text-sm font-medium text-muted-foreground">API Status</p>
                                    <p className="text-2xl font-bold text-green-600">Operational</p>
                                </div>
                                <div className="p-4 border rounded-lg bg-slate-50/50 text-center">
                                    <p className="text-sm font-medium text-muted-foreground">Database</p>
                                    <p className="text-2xl font-bold text-green-600">Healthy</p>
                                </div>
                                <div className="p-4 border rounded-lg bg-slate-50/50 text-center">
                                    <p className="text-sm font-medium text-muted-foreground">Storage</p>
                                    <p className="text-2xl font-bold text-slate-900">42% Used</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <Button variant="destructive" className="gap-2">
                                    Clear System Cache
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
