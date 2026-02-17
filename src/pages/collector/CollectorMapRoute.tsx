import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, TrendingUp, Clock } from 'lucide-react';

const CollectorMapRoute = () => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const routeStops = [
        { id: '1', lat: 28.2096, lng: 83.9856, address: 'Lakeside, Ward 6', status: 'completed', order: 1 },
        { id: '2', lat: 28.2116, lng: 83.9896, address: 'Mahendrapul, Ward 1', status: 'completed', order: 2 },
        { id: '3', lat: 28.2076, lng: 83.9876, address: 'Matepani, Ward 5', status: 'in-progress', order: 3 },
        { id: '4', lat: 28.2136, lng: 83.9916, address: 'Bagar, Ward 2', status: 'pending', order: 4 },
        { id: '5', lat: 28.2056, lng: 83.9836, address: 'Chipledhunga', status: 'pending', order: 5 },
    ];

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current).setView([28.2096, 83.9856], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        mapRef.current = map;

        // Add route markers
        routeStops.forEach((stop) => {
            const color =
                stop.status === 'completed' ? '#22c55e' : stop.status === 'in-progress' ? '#f59e0b' : '#6b7280';

            const marker = L.marker([stop.lat, stop.lng], {
                icon: L.divIcon({
                    className: 'route-marker',
                    html: `<div style="position: relative;">
            <div style="background: ${color}; width: 36px; height: 36px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 14px;">
              ${stop.order}
            </div>
            ${stop.status === 'in-progress' ? '<div style="position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; background: #3b82f6; border-radius: 50%; animation: pulse 2s infinite;"></div>' : ''}
          </div>`,
                    iconSize: [36, 36],
                }),
            }).addTo(map);

            marker.bindPopup(`
        <div style="min-width: 180px;">
          <h3 style="font-weight: bold; margin-bottom: 8px;">Stop ${stop.order}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${stop.address}</p>
          <p style="font-size: 12px; margin-bottom: 8px;">Status: <span style="color: ${color}; text-transform: capitalize; font-weight: 600;">${stop.status.replace('-', ' ')}</span></p>
        </div>
      `);
        });

        // Draw optimized route
        const routeCoordinates: [number, number][] = routeStops.map((stop) => [stop.lat, stop.lng]);
        const routeLine = L.polyline(routeCoordinates, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.7,
        }).addTo(map);

        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Route Map</h2>
                <p className="text-muted-foreground">Your optimized collection route for today</p>
            </div>

            {/* Route Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Total Stops
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{routeStops.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-muted-foreground" />
                            Distance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45.2 km</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Est. Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3.5 hrs</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            Efficiency
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-eco-600">92%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Map */}
            <Card className="overflow-hidden">
                <div ref={mapContainerRef} style={{ height: '600px', width: '100%', borderRadius: '8px' }} />
            </Card>

            {/* Route Stops List */}
            <Card>
                <CardHeader>
                    <CardTitle>Route Stops</CardTitle>
                    <CardDescription>Optimized collection sequence</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {routeStops.map((stop) => (
                            <div
                                key={stop.id}
                                className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
                            >
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${stop.status === 'completed'
                                        ? 'bg-eco-500'
                                        : stop.status === 'in-progress'
                                            ? 'bg-amber-500'
                                            : 'bg-gray-400'
                                        }`}
                                >
                                    {stop.order}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{stop.address}</p>
                                    <Badge
                                        variant={
                                            stop.status === 'completed' ? 'success' : stop.status === 'in-progress' ? 'warning' : 'secondary'
                                        }
                                        className="mt-1 capitalize"
                                    >
                                        {stop.status.replace('-', ' ')}
                                    </Badge>
                                </div>
                                {stop.status !== 'completed' && (
                                    <Button size="sm" variant={stop.status === 'in-progress' ? 'default' : 'outline'}>
                                        {stop.status === 'in-progress' ? 'Complete' : 'Navigate'}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CollectorMapRoute;
