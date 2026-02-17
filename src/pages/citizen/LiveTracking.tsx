import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, MapPin, Clock, CheckCircle, Navigation } from 'lucide-react';

const LiveTracking = () => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [truckLocation, setTruckLocation] = useState<[number, number]>([28.2096, 83.9856]);
    const [eta, setEta] = useState(15);

    // Mock pickup data
    const pickup = {
        id: 'PU-2024-001',
        collectorName: 'John Smith',
        truckNumber: 'TRK-042',
        status: 'en-route',
        scheduledTime: '10:00 AM',
        currentLocation: 'Near Lakeside Road',
    };

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Initialize map
        const map = L.map(mapContainerRef.current).setView(truckLocation, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        mapRef.current = map;

        // Add truck marker
        const truckMarker = L.marker(truckLocation, {
            icon: L.divIcon({
                className: 'truck-marker',
                html: `<div style="background: #3b82f6; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
            <path d="M15 18H9"></path>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
            <circle cx="17" cy="18" r="2"></circle>
            <circle cx="7" cy="18" r="2"></circle>
          </svg>
        </div>`,
                iconSize: [40, 40],
            }),
        }).addTo(map);

        truckMarker.bindPopup(`
      <div style="min-width: 200px;">
        <h3 style="font-weight: bold; margin-bottom: 8px;">Garbage Truck ${pickup.truckNumber}</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 4px;">Driver: ${pickup.collectorName}</p>
        <p style="font-size: 12px; color: #22c55e; margin-bottom: 4px;">Status: On the way</p>
        <p style="font-size: 12px; color: #666;">ETA: ${eta} minutes</p>
      </div>
    `);

        // Add destination marker (user location)
        L.marker([28.2116, 83.9896], {
            icon: L.divIcon({
                className: 'destination-marker',
                html: `<div style="background: #22c55e; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>`,
                iconSize: [30, 30],
            }),
        })
            .addTo(map)
            .bindPopup('<b>Your Pickup Location</b>')
            .openPopup();

        // Draw route line
        const routeLine = L.polyline(
            [
                truckLocation,
                [28.2106, 83.9876],
                [28.2116, 83.9896],
            ],
            {
                color: '#3b82f6',
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 10',
            }
        ).addTo(map);

        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

        // Simulate truck movement
        const interval = setInterval(() => {
            setTruckLocation((prev) => {
                const newLat = prev[0] + 0.0002;
                const newLng = prev[1] + 0.0004;
                truckMarker.setLatLng([newLat, newLng]);
                return [newLat, newLng];
            });
            setEta((prev) => Math.max(1, prev - 1));
        }, 3000);

        return () => {
            clearInterval(interval);
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Live Tracking</h2>
                <p className="text-muted-foreground">Track your garbage truck in real-time</p>
            </div>

            {/* Status Card */}
            <Card className="border-eco-200 bg-eco-50/50 dark:bg-eco-900/10">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-eco-500 flex items-center justify-center">
                                <Truck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Truck is on the way!</CardTitle>
                                <CardDescription className="mt-1">
                                    Pickup ID: <span className="font-mono font-semibold">{pickup.id}</span>
                                </CardDescription>
                            </div>
                        </div>
                        <Badge variant="success" className="text-sm">
                            En Route
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                <Clock className="h-5 w-5 text-eco-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Estimated Time</p>
                                <p className="font-semibold text-lg">{eta} min</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                <Navigation className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Current Location</p>
                                <p className="font-semibold">{pickup.currentLocation}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Scheduled At</p>
                                <p className="font-semibold">{pickup.scheduledTime}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Map */}
            <Card className="overflow-hidden">
                <div ref={mapContainerRef} style={{ height: '600px', width: '100%', borderRadius: '8px' }} />
            </Card>

            {/* Collector Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Collector Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                            {pickup.collectorName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-lg">{pickup.collectorName}</p>
                            <p className="text-sm text-muted-foreground">Truck Number: {pickup.truckNumber}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="success">4.8 ⭐ Rating</Badge>
                                <Badge variant="secondary">250+ Pickups</Badge>
                            </div>
                        </div>
                        <Button variant="outline">
                            <MapPin className="h-4 w-4 mr-2" />
                            Contact
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">What to do when the truck arrives?</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-2 text-sm">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                1
                            </span>
                            <span>Keep your segregated waste ready at the pickup point</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                2
                            </span>
                            <span>Show the QR code to the collector for verification</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                3
                            </span>
                            <span>Wait for credit points confirmation notification</span>
                        </li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
};

export default LiveTracking;
