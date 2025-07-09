import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import OverviewPage from './dashboard/Overview';
import DestinationsPage from './dashboard/Destinations';
import TripsPage from './dashboard/Trips';
import PackagesPage from './dashboard/Packages';
import ExperiencesPage from './dashboard/Experiences';
import TestimonialsPage from './dashboard/Testimonials';
import OrdersPage from './dashboard/Orders';
import AnalyticsPage from './dashboard/Analytics';
import HeroSectionEditor from './dashboard/HeroSectionEditor';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-xl font-bold">Checking authentication...</div>;
  }
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1">
          <Routes>
            <Route path="" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="destinations" element={<DestinationsPage />} />
            <Route path="trips" element={<TripsPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="experiences" element={<ExperiencesPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="herosection-editor" element={<HeroSectionEditor />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
