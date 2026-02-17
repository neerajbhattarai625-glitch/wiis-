export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'collector' | 'citizen';
    avatar?: string;
    creditPoints?: number;
    createdAt: string;
}

export interface WastePickup {
    id: string;
    citizenId: string;
    citizenName: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    wasteType: 'recyclable' | 'organic' | 'hazardous' | 'general';
    weight?: number;
    status: 'pending' | 'assigned' | 'collected' | 'completed' | 'cancelled';
    qrCode?: string;
    collectorId?: string;
    collectorName?: string;
    requestedAt: string;
    scheduledAt?: string;
    completedAt?: string;
    points?: number;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    actionUrl?: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    pointsRequired: number;
    category: string;
    stock: number;
    rating?: number;
    reviews?: ProductReview[];
}

export interface ProductReview {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface Order {
    id: string;
    userId: string;
    products: OrderItem[];
    totalPoints: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: string;
    orderedAt: string;
    deliveredAt?: string;
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    pointsPerUnit: number;
}

export interface Complaint {
    id: string;
    userId: string;
    userName: string;
    title: string;
    description: string;
    category: 'missed-pickup' | 'improper-collection' | 'bin-damage' | 'other';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    images?: string[];
    response?: string;
    createdAt: string;
    resolvedAt?: string;
}

export interface Route {
    id: string;
    collectorId: string;
    date: string;
    pickups: WastePickup[];
    optimizedPath: {
        lat: number;
        lng: number;
    }[];
    totalDistance: number;
    estimatedTime: number;
    status: 'pending' | 'in-progress' | 'completed';
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    pointsRequired: number;
    unlockedAt?: string;
}

export interface DashboardStats {
    totalUsers?: number;
    activeCollectors?: number;
    wasteCollected?: number;
    recyclingRate?: number;
    carbonSaved?: number;
    creditPoints?: number;
    pendingPickups?: number;
    completedPickups?: number;
}
