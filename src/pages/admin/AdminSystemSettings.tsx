import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Settings,
    Save,
    RefreshCcw,
    ShieldCheck,
    Database,
    HardDrive,
    BadgePercent,
    Coins,
    History,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface SystemSettings {
    credits_per_kg: number;
    referral_bonus: number;
    withdrawal_minimum: number;
    system_version: string;
}

const AdminSystemSettings = () => {
    const [settings, setSettings] = useState<SystemSettings>({
        credits_per_kg: 10,
        referral_bonus: 50,
        withdrawal_minimum: 1000,
        system_version: '1.0.0'
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            const response = await fetch(`${API_URL}/api/admin/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-eco-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">System Configuration</h2>
                    <p className="text-muted-foreground">Manage global parameters and reward economics</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchSettings}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Reload
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-eco-600 hover:bg-eco-700"
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {saveSuccess && (
                <div className="bg-eco-50 border border-eco-200 text-eco-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Settings updated successfully!</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Economy Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-eco-700">
                                <Coins className="h-5 w-5" />
                                Reward Economics
                            </CardTitle>
                            <CardDescription>Configure how points are earned and spent</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="creditsPerKg">Credits per Kilogram</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="creditsPerKg"
                                            type="number"
                                            value={settings.credits_per_kg}
                                            onChange={(e) => setSettings({ ...settings, credits_per_kg: parseFloat(e.target.value) })}
                                        />
                                        <Badge variant="secondary">pts/kg</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Multiplied by waste weight to calculate rewards.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="referralBonus">Referral Bonus</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="referralBonus"
                                            type="number"
                                            value={settings.referral_bonus}
                                            onChange={(e) => setSettings({ ...settings, referral_bonus: parseInt(e.target.value) })}
                                        />
                                        <Badge variant="secondary">pts</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Fixed amount given when a new user signs up.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="withdrawalMin">Withdrawal Minimum</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="withdrawalMin"
                                            type="number"
                                            value={settings.withdrawal_minimum}
                                            onChange={(e) => setSettings({ ...settings, withdrawal_minimum: parseInt(e.target.value) })}
                                        />
                                        <Badge variant="secondary">pts</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Minimum points required to redeem for cash/gifts.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <ShieldCheck className="h-5 w-5" />
                                Operational Controls
                            </CardTitle>
                            <CardDescription>Security and validation parameters</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border rounded-lg">
                                <div>
                                    <p className="font-semibold text-sm">Require Image Verification</p>
                                    <p className="text-xs text-muted-foreground">Forces citizens to upload photos for all reports.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border rounded-lg">
                                <div>
                                    <p className="font-semibold text-sm">Automated Route Assignment</p>
                                    <p className="text-xs text-muted-foreground">Use AI to assign pickup requests to nearest collectors.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border rounded-lg opacity-50 cursor-not-allowed">
                                <div>
                                    <p className="font-semibold text-sm">Public Leaderboard</p>
                                    <p className="text-xs text-muted-foreground">Make citizen rankings visible to all users.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: System Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-indigo-600" />
                                System Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Backend Version</p>
                                <p className="font-mono text-lg">{settings.system_version}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Database Engine</p>
                                <p className="flex items-center gap-2 font-semibold">
                                    <HardDrive className="h-4 w-4" />
                                    MongoDB v6.0.4
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Server Region</p>
                                <p className="text-sm font-semibold">Asia-South1 (Pokhara Local)</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card border-dashed className="border-eco-200">
                        <CardHeader>
                            <CardTitle className="text-sm">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start text-xs font-normal h-8">
                                <History className="h-3 w-3 mr-2" /> View Audit Logs
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-xs font-normal h-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                <RefreshCcw className="h-3 w-3 mr-2" /> Reset Monthly Stats
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminSystemSettings;
