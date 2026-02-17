import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        // Redirect to unauthorized page or back to their role dashboard
        // For now, redirect to their actual dashboard
        return <Navigate to={`/${userRole}`} replace />;
    }

    return <>{children}</>;
};

// Also export a public route wrapper to redirect authenticated users away from landing/login
export const PublicRoute = ({ children }: { children: ReactNode }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (isAuthenticated && userRole) {
        return <Navigate to={`/${userRole}`} replace />;
    }

    return <>{children}</>;
};


export default ProtectedRoute;
