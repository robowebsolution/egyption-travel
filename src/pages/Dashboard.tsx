
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import OverviewPage from './dashboard/Overview';
import DestinationsPage from './dashboard/Destinations';
import PackagesPage from './dashboard/Packages';
import ExperiencesPage from './dashboard/Experiences';
import TestimonialsPage from './dashboard/Testimonials';
import OrdersPage from './dashboard/Orders';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1">
          <Routes>
            <Route path="" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="destinations" element={<DestinationsPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="experiences" element={<ExperiencesPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="orders" element={<OrdersPage />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
