import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import ProtectedRoute, { PublicRoute } from './components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';


// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import InteractiveMap from './pages/citizen/InteractiveMap';
import LiveTracking from './pages/citizen/LiveTracking';
import Marketplace from './pages/citizen/Marketplace';
import ComplaintFeedback from './pages/citizen/ComplaintFeedback';
import AIWasteSegregation from './pages/citizen/AIWasteSegregation';
import Notifications from './pages/citizen/Notifications';
import Profile from './pages/citizen/Profile';
import ARSorter from './pages/citizen/ARSorter';

// Collector Pages
import CollectorDashboard from './pages/collector/CollectorDashboard';
import CollectorMapRoute from './pages/collector/CollectorMapRoute';
import CollectorPickupVerification from './pages/collector/CollectorPickupVerification';
import CollectorPerformance from './pages/collector/CollectorPerformance';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminMarketplaceManagement from './pages/admin/AdminMarketplaceManagement';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminFeedbackManagement from './pages/admin/AdminFeedbackManagement';
import AdminAIInsights from './pages/admin/AdminAIInsights';
import AdminLeaderboard from './pages/admin/AdminLeaderboard';
import AdminSystemSettings from './pages/admin/AdminSystemSettings';

import { useEffect } from 'react';
import Lenis from 'lenis';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Citizen Routes - Protected */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <DashboardLayout role="citizen">
                <CitizenDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/map"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <DashboardLayout role="citizen">
                <InteractiveMap />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/tracking"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <DashboardLayout role="citizen">
                <LiveTracking />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/marketplace"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <DashboardLayout role="citizen">
                <Marketplace />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/complaints"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <DashboardLayout role="citizen">
                <ComplaintFeedback />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/ai-assistant"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <DashboardLayout role="citizen">
                <AIWasteSegregation />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/ar-scan"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <ARSorter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/notifications"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <DashboardLayout role="citizen">
                <Notifications />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/profile"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <DashboardLayout role="citizen">
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Collector Routes - Protected */}
        <Route
          path="/collector"
          element={
            <ProtectedRoute allowedRoles={['collector']}>
              <DashboardLayout role="collector">
                <CollectorDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/collector/route"
          element={
            <ProtectedRoute allowedRoles={['collector']}>
              <DashboardLayout role="collector">
                <CollectorMapRoute />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/collector/verify"
          element={
            <ProtectedRoute allowedRoles={['collector']}>
              <DashboardLayout role="collector">
                <CollectorPickupVerification />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/collector/performance"
          element={
            <ProtectedRoute allowedRoles={['collector']}>
              <DashboardLayout role="collector">
                <CollectorPerformance />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <AdminUserManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/marketplace"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <AdminMarketplaceManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <AdminAnnouncements />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <AdminFeedbackManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ai-insights"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <AdminAIInsights />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leaderboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <AdminLeaderboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <AdminSystemSettings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback route - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
