import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  MapPin, 
  Package, 
  Star, 
  Heart,
  Settings,
  Home,
  ShoppingBag,
  Calendar,
  LogOut,
  PieChart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const menuItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    id: "overview"
  },
  {
    title: "التحليلات",
    icon: PieChart,
    id: "analytics"
  },
  {
    title: "الوجهات السياحية",
    icon: MapPin,
    id: "destinations"
  },
  {
    title: "الرحلات السياحية",
    icon: Calendar,
    id: "trips"
  },
  {
    title: "الباقات السياحية",
    icon: Package,
    id: "packages"
  },
  {
    title: "التجارب السياحية",
    icon: Heart,
    id: "experiences"
  },
  {
    title: "آراء العملاء",
    icon: Star,
    id: "testimonials"
  },
  {
    title: "الطلبات",
    icon: ShoppingBag,
    id: "orders"
  },
  {
    title: "صور الهيرو سيكشن",
    icon: Star, // يمكنك استبدال الأيقونة بما يناسبك
    id: "herosection-editor"
  }
];

const bottomMenuItems = [
  {
    title: "العودة للموقع",
    icon: Home,
    id: "website"
  },
  {
    title: "الإعدادات",
    icon: Settings,
    id: "settings"
  }
];

import { useNavigate } from 'react-router-dom';

export function DashboardSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-pharaoh-500 to-pharaoh-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">Egypt Travel</h2>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Content Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => navigate(`/dashboard/${item.id}`)}
                    className={`w-full justify-start hover:bg-gray-100 ${window.location.pathname.endsWith(item.id) ? 'bg-pharaoh-50 text-pharaoh-700 font-bold' : ''}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => {
  if (item.id === 'website') {
    window.open('/', '_blank');
  }
}}
                    className="w-full justify-start hover:bg-gray-100"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* زر تسجيل الخروج */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="w-full justify-start hover:bg-red-50 text-red-600 font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
