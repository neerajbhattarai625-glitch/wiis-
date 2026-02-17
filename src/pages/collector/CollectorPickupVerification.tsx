import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, CheckCircle, Image as ImageIcon, Weight } from 'lucide-react';

const CollectorPickupVerification = () => {
    const [scanningMode, setScanningMode] = useState<'qr' | 'manual' | null>(null);
    const [verifiedPickup, setVerifiedPickup] = useState<any>(null);

    const pendingPickups = [
        {
            id: 'PU-2024-001',
            citizenName: 'Jane Citizen',
            location: 'Lakeside, Ward 6',
            wasteType: 'recyclable',
            estimatedWeight: '5 kg',
            scheduledTime: '10:00 AM',
        },
        {
            id: 'PU-2024-002',
            citizenName: 'John Doe',
            location: 'Mahendrapul, Ward 1',
            wasteType: 'organic',
            estimatedWeight: '8 kg',
            scheduledTime: '10:45 AM',
        },
    ];

    const handleScanQR = () => {
        setScanningMode('qr');
        // Simulate QR scanning
        setTimeout(() => {
            setVerifiedPickup({
                id: 'PU-2024-001',
                citizenName: 'Jane Citizen',
                location: 'Lakeside, Ward 6',
                wasteType: 'recyclable',
                weight: 4.8,
                points: 48,
                segregationQuality: 'excellent',
            });
            setScanningMode(null);
        }, 2000);
    };

    const handleManualEntry = () => {
        setScanningMode('manual');
    };

    const handleSubmitVerification = () => {
        // Submit verification
        alert('Pickup verified successfully! 48 points credited to citizen.');
        setVerifiedPickup(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Pickup Verification</h2>
                <p className="text-muted-foreground">Scan QR codes and verify waste collections</p>
            </div>

            {/* Quick Scan Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Button
                    className="h-32 flex flex-col gap-3 bg-gradient-to-br from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700 text-white border-0"
                    onClick={handleScanQR}
                    disabled={scanningMode !== null}
                >
                    <QrCode className="h-12 w-12" />
                    <span className="text-lg font-semibold">Scan QR Code</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-32 flex flex-col gap-3"
                    onClick={handleManualEntry}
                    disabled={scanningMode !== null}
                >
                    <ImageIcon className="h-12 w-12" />
                    <span className="text-lg font-semibold">Manual Entry</span>
                </Button>
            </div>

            {/* Scanning Status */}
            {scanningMode === 'qr' && (
                <Card className="border-eco-200 bg-eco-50/50 dark:bg-eco-900/10">
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-eco-500 flex items-center justify-center animate-pulse">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                            <p className="text-lg font-semibold mb-2">Scanning QR Code...</p>
                            <p className="text-sm text-muted-foreground">Position the QR code within the frame</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Verification Result */}
            {verifiedPickup && (
                <Card className="border-eco-200">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Pickup Verified!</CardTitle>
                                <CardDescription className="mt-1">
                                    Pickup ID: <span className="font-mono font-semibold">{verifiedPickup.id}</span>
                                </CardDescription>
                            </div>
                            <CheckCircle className="h-12 w-12 text-eco-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Citizen Name</p>
                                <p className="font-semibold">{verifiedPickup.citizenName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Location</p>
                                <p className="font-semibold">{verifiedPickup.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Waste Type</p>
                                <Badge variant="success" className="capitalize">
                                    {verifiedPickup.wasteType}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Weight Collected</p>
                                <p className="font-semibold flex items-center gap-2">
                                    <Weight className="h-4 w-4" />
                                    {verifiedPickup.weight} kg
                                </p>
                            </div>
                        </div>

                        <div className="bg-eco-50 dark:bg-eco-900/20 rounded-lg p-4 border-l-4 border-eco-500">
                            <p className="text-sm text-muted-foreground mb-2">Segregation Quality</p>
                            <div className="flex items-center gap-2">
                                <Badge variant="success" className="text-base capitalize">
                                    {verifiedPickup.segregationQuality}
                                </Badge>
                                <span className="text-sm font-semibold text-eco-600">
                                    +{verifiedPickup.points} Points to Citizen
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button className="flex-1 bg-eco-500 hover:bg-eco-600" onClick={handleSubmitVerification}>
                                Confirm & Award Points
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => setVerifiedPickup(null)}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pending Pickups */}
            <Card>
                <CardHeader>
                    <CardTitle>Pending Pickups</CardTitle>
                    <CardDescription>Waiting for verification</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {pendingPickups.map((pickup) => (
                            <div key={pickup.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div>
                                        <p className="font-semibold">{pickup.citizenName}</p>
                                        <p className="text-sm text-muted-foreground">{pickup.location}</p>
                                    </div>
                                    <Badge variant="secondary" className="font-mono">
                                        {pickup.id}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                                    <div>
                                        <p className="text-muted-foreground">Type</p>
                                        <p className="font-medium capitalize">{pickup.wasteType}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Est. Weight</p>
                                        <p className="font-medium">{pickup.estimatedWeight}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Time</p>
                                        <p className="font-medium">{pickup.scheduledTime}</p>
                                    </div>
                                </div>
                                <Button size="sm" className="w-full" onClick={handleScanQR}>
                                    <QrCode className="h-4 w-4 mr-2" />
                                    Scan to Verify
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Today's Verified Pickups */}
            <Card>
                <CardHeader>
                    <CardTitle>Today's Verified Pickups</CardTitle>
                    <CardDescription>Successfully completed collections</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[
                            { id: 'PU-2024-003', citizen: 'Alice Smith', weight: 6.2, points: 62, time: '09:15 AM' },
                            { id: 'PU-2024-004', citizen: 'Bob Johnson', weight: 3.5, points: 35, time: '09:45 AM' },
                        ].map((pickup) => (
                            <div
                                key={pickup.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-accent"
                            >
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-eco-600" />
                                    <div>
                                        <p className="font-semibold text-sm">{pickup.citizen}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {pickup.weight} kg • {pickup.time}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="success">+{pickup.points} pts</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CollectorPickupVerification;
