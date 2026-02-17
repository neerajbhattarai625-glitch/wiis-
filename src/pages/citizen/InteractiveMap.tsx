import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Filter, Search, Trash2, Recycle, AlertTriangle } from 'lucide-react';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const InteractiveMap = () => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    // Mock collection points data
    const collectionPoints = [
        { id: '1', lat: 28.2096, lng: 83.9856, name: 'Central Collection Point', type: 'general', status: 'active' },
        { id: '2', lat: 28.2116, lng: 83.9896, name: 'Recycling Center', type: 'recyclable', status: 'active' },
        { id: '3', lat: 28.2056, lng: 83.9816, name: 'Organic Waste Hub', type: 'organic', status: 'active' },
        { id: '4', lat: 28.2136, lng: 83.9836, name: 'Hazardous Waste Facility', type: 'hazardous', status: 'maintenance' },
    ];

    const wasteTypes = [
        { value: 'all', label: 'All', icon: MapPin, color: 'bg-gray-500' },
        { value: 'recyclable', label: 'Recyclable', icon: Recycle, color: 'bg-eco-500' },
        { value: 'organic', label: 'Organic', icon: Trash2, color: 'bg-amber-500' },
        { value: 'hazardous', label: 'Hazardous', icon: AlertTriangle, color: 'bg-red-500' },
    ];

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Initialize map
        const map = L.map(mapContainerRef.current).setView([28.2096, 83.9856], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        mapRef.current = map;

        // Try to get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);

                    // Add user location marker
                    L.marker([latitude, longitude], {
                        icon: L.divIcon({
                            className: 'user-location-marker',
                            html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
                            iconSize: [16, 16],
                        }),
                    })
                        .addTo(map)
                        .bindPopup('<b>Your Location</b>')
                        .openPopup();

                    map.setView([latitude, longitude], 15);
                },
                () => {
                    console.log('Unable to retrieve your location');
                }
            );
        }

        // Add collection points
        collectionPoints.forEach((point) => {
            const iconColor =
                point.type === 'recyclable'
                    ? '#22c55e'
                    : point.type === 'organic'
                        ? '#f59e0b'
                        : point.type === 'hazardous'
                            ? '#ef4444'
                            : '#6b7280';

            const marker = L.marker([point.lat, point.lng], {
                icon: L.divIcon({
                    className: 'collection-point-marker',
                    html: `<div style="background: ${iconColor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </div>`,
                    iconSize: [30, 30],
                }),
            }).addTo(map);

            marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px;">${point.name}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 4px;">Type: <span style="text-transform: capitalize;">${point.type}</span></p>
          <p style="font-size: 12px; color: #666; margin-bottom: 8px;">Status: <span style="color: ${point.status === 'active' ? '#22c55e' : '#f59e0b'}; text-transform: capitalize;">${point.status}</span></p>
          <button style="background: #22c55e; color: white; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; width: 100%; font-size: 12px;">Request Pickup Here</button>
        </div>
      `);
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    const centerOnUser = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.setView(userLocation, 15);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Interactive Map</h2>
                    <p className="text-muted-foreground">Find collection points and request pickups</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={centerOnUser}>
                        <Navigation className="h-4 w-4 mr-2" />
                        My Location
                    </Button>
                    <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter Collection Points
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {wasteTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <Button
                                    key={type.value}
                                    variant={selectedFilter === type.value ? 'default' : 'outline'}
                                    size="sm"
                                    className={selectedFilter === type.value ? type.color : ''}
                                    onClick={() => setSelectedFilter(type.value)}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {type.label}
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Map */}
            <Card className="overflow-hidden">
                <div ref={mapContainerRef} style={{ height: '600px', width: '100%', borderRadius: '8px' }} />
            </Card>

            {/* Collection Points Info */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {collectionPoints.map((point) => (
                    <Card key={point.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-base">{point.name}</CardTitle>
                                <Badge variant={point.status === 'active' ? 'success' : 'warning'}>
                                    {point.status}
                                </Badge>
                            </div>
                            <CardDescription className="text-xs capitalize">{point.type} waste</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button size="sm" className="w-full bg-eco-500 hover:bg-eco-600">
                                Request Pickup
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default InteractiveMap;
