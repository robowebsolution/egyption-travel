import React from 'react';
import { Card } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatUSD } from '@/lib/currency';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line, ResponsiveContainer
} from 'recharts';

// 1. جلب المؤشرات الإجمالية
const fetchAnalytics = async () => {
  // إجمالي الطلبات
  const { count: totalOrders } = await supabase.from('users').select('*', { count: 'exact', head: true });
  // إجمالي الإيرادات
  const { data: revenueData } = await supabase.from('users').select('price, status');
  const totalRevenue = revenueData?.filter((r: any) => r.status === 'approved').reduce((sum: number, r: any) => sum + (Number(r.price) || 0), 0) || 0;
  // الطلبات حسب النوع
  const { data: typeCounts } = await supabase.from('users').select('source_page');
  const typeStats = ['package', 'experience', 'trip'].map(type => ({
    type,
    count: typeCounts?.filter((r: any) => r.source_page === type).length || 0
  }));
  // الطلبات حسب الحالة
  const { data: statusCounts } = await supabase.from('users').select('status');
  const statusStats = ['pending', 'approved', 'rejected'].map(status => ({
    status,
    count: statusCounts?.filter((r: any) => r.status === status).length || 0
  }));
  return { totalOrders, totalRevenue, typeStats, statusStats };
};

// 2. رسم بياني للطلبات الشهرية
const fetchOrdersPerMonth = async () => {
  const { data } = await supabase.rpc('orders_per_month_users');
  return data || [];
};

// 3. رسم بياني للإيرادات الشهرية
const fetchRevenuePerMonth = async () => {
  const { data } = await supabase.rpc('revenue_per_month_users');
  return data || [];
};

// 4. أكثر العناصر طلبًا
const fetchTopItems = async () => {
  const { data } = await supabase.rpc('top_items_users');
  return data || [];
};

const AnalyticsPage = () => {
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics
  });
  const { data: ordersPerMonth } = useQuery({
    queryKey: ['ordersPerMonth'],
    queryFn: fetchOrdersPerMonth
  });
  const { data: revenuePerMonth } = useQuery({
    queryKey: ['revenuePerMonth'],
    queryFn: fetchRevenuePerMonth
  });
  const { data: topItems } = useQuery({
    queryKey: ['topItems'],
    queryFn: fetchTopItems
  });

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">لوحة التحليلات والإحصائيات</h1>
      {/* مؤشرات إجمالية */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-pharaoh-700">{loadingAnalytics ? '...' : analytics?.totalOrders ?? 0}</span>
          <span className="text-gray-500 mt-2">إجمالي الطلبات</span>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-pharaoh-700">{loadingAnalytics ? '...' : (analytics ? formatUSD(analytics.totalRevenue) : '$0')}</span>
          <span className="text-gray-500 mt-2">إجمالي الإيرادات (الموافق عليها)</span>
        </Card>
        {analytics?.typeStats?.map((t: any) => (
          <Card key={t.type} className="p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-pharaoh-700">{t.count}</span>
            <span className="text-gray-500 mt-2">طلبات {t.type === 'package' ? 'الباقات' : t.type === 'experience' ? 'التجارب' : 'الرحلات'}</span>
          </Card>
        ))}
        {analytics?.statusStats?.map((s: any) => (
          <Card key={s.status} className="p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-pharaoh-700">{s.count}</span>
            <span className="text-gray-500 mt-2">طلبات {s.status === 'pending' ? 'قيد المراجعة' : s.status === 'approved' ? 'الموافق عليها' : 'المرفوضة'}</span>
          </Card>
        ))}
      </div>
      {/* رسم بياني للطلبات الشهرية */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">توزيع الطلبات على الشهور</h2>
        <div className="h-72">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersPerMonth ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#eab308" name="عدد الطلبات" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
      {/* رسم بياني للإيرادات الشهرية */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">الإيرادات الشهرية (الموافق عليها)</h2>
        <div className="h-72">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenuePerMonth ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" fill="rgba(22,163,74,0.2)" name="الإيرادات ($)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
      {/* أكثر العناصر طلبًا */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">أكثر العناصر طلبًا</h2>
        <div className="h-72">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2563eb" name="عدد الطلبات" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 