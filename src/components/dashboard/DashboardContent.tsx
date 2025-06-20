
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardOverview } from './sections/DashboardOverview';
import { DestinationsManager } from './sections/DestinationsManager';
import { PackagesManager } from './sections/PackagesManager';
import { ExperiencesManager } from './sections/ExperiencesManager';
import { TestimonialsManager } from './sections/TestimonialsManager';

export function DashboardContent() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'destinations':
        return <DestinationsManager />;
      case 'packages':
        return <PackagesManager />;
      case 'experiences':
        return <ExperiencesManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen">
      <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-2xl font-bold text-gray-900 capitalize" dir="rtl">
  {activeSection === 'overview' && 'لوحة التحكم - نظرة عامة'}
  {activeSection === 'destinations' && 'إدارة الوجهات السياحية'}
  {activeSection === 'packages' && 'إدارة الباقات السياحية'}
  {activeSection === 'experiences' && 'إدارة التجارب السياحية'}
  {activeSection === 'testimonials' && 'إدارة آراء العملاء'}
</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
