
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Package, Heart, Star, TrendingUp, Users } from 'lucide-react';
import { useDestinations } from '@/hooks/useDestinations';
import { usePackages } from '@/hooks/usePackages';
import { useExperiences } from '@/hooks/useExperiences';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useTrips } from '@/hooks/useTrips';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

import { useNavigate } from 'react-router-dom';

export function DashboardOverview() {
  const { data: destinations } = useDestinations();
  const { data: packages } = usePackages();
  const { data: experiences } = useExperiences();
  const { data: testimonials } = useTestimonials();
  const { data: trips } = useTrips();
  const navigate = useNavigate();

  const { data: ordersData } = useQuery({
    queryKey: ['dashboard-orders-summary'],
    queryFn: async () => {
      const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { data: lastOrder } = await supabase
        .from('users')
        .select('name, created_at, source_page, source_name')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return { count, lastOrder };
    }
  });

  const stats = [
    {
      title: 'إجمالي الوجهات السياحية',
      value: destinations?.length || 0,
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      to: '/dashboard/destinations'
    },
    {
      title: 'عدد الباقات السياحية',
      value: packages?.length || 0,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      to: '/dashboard/packages'
    },
    {
      title: 'عدد التجارب السياحية',
      value: experiences?.length || 0,
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      to: '/dashboard/experiences'
    },
    {
      title: 'عدد الرحلات السياحية',
      value: trips?.length || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      to: '/dashboard/trips'
    },
    {
      title: 'آراء العملاء',
      value: testimonials?.length || 0,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      to: '/dashboard/testimonials'
    }
  ];

  return (
    <div className="space-y-6 m-[25px]">
      {/* ملخص الطلبات */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
        <div className="bg-pharaoh-50 border border-pharaoh-200 rounded-lg px-6 py-3 flex items-center gap-4">
          <span className="font-bold text-pharaoh-700 text-lg">عدد الطلبات الكلي:</span>
          <span className="text-2xl font-bold text-pharaoh-900">{ordersData?.count ?? '...'}</span>
        </div>
        {ordersData?.lastOrder && (
          <div className="bg-pharaoh-50 border border-pharaoh-200 rounded-lg px-6 py-3 flex items-center gap-4">
            <span className="font-bold text-pharaoh-700 text-lg">آخر طلب:</span>
            <span className="text-pharaoh-900">{ordersData.lastOrder.name}</span>
            <span className="text-gray-500">{ordersData.lastOrder.source_page === 'package' ? 'باقة' : ordersData.lastOrder.source_page === 'experience' ? 'تجربة' : ordersData.lastOrder.source_page === 'trip' ? 'رحلة' : ordersData.lastOrder.source_page}</span>
            <span className="text-gray-700">{ordersData.lastOrder.source_name}</span>
            <span className="text-gray-400 text-sm">{new Date(ordersData.lastOrder.created_at).toLocaleString('ar-EG')}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => stat.to && navigate(stat.to)}
          >
            <CardContent className="flex items-center p-6">
              <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              النشاطات الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              
              < div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">آخر رأي عميل</span>
                <span className="text-sm font-medium">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">تمت إضافة باقة جديدة</span>
                <span className="text-sm font-medium">1 day ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">تم تحديث وجهة سياحية</span>
                <span className="text-sm font-medium">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              إجراءات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
  onClick={() => navigate('/dashboard/destinations')}
>
  <div className="font-medium text-gray-900">إضافة وجهة جديدة</div>
</button>
<button
  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
  onClick={() => navigate('/dashboard/trips')}
>
  <div className="font-medium text-gray-900"> اضافة رحلة سياحية جديدة </div>
</button>
  <button
  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
  onClick={() => navigate('/dashboard/packages')}
>
  <div className="font-medium text-gray-900">إضافة باقة سياحية جديدة</div>
</button>
<button
  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
  onClick={() => navigate('/dashboard/experiences')}
>
  <div className="font-medium text-gray-900">إضافة تجربة جديدة</div>
</button>
              <button
  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
  onClick={() => navigate('/dashboard/analytics')}
>
  <div className="font-medium text-gray-900">عرض الإحصائيات</div>
  <div className="text-sm text-gray-500">عرض أداء الموقع</div>
</button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>مرحباً بك في لوحة التحكم</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            من خلال لوحة التحكم هذه يمكنك إدارة محتوى موقعك السياحي بالكامل باحترافية. يمكنك إضافة وتعديل وحذف الوجهات، الباقات، التجارب، وآراء العملاء بسهولة.
          </p>
          <div className="bg-pharaoh-50 border border-pharaoh-200 rounded-lg p-4">
            <h4 className="font-semibold text-pharaoh-800 mb-2">دليل البدء السريع</h4>
            <ul className="text-sm text-pharaoh-700 space-y-1">
              <li>• استخدم القائمة الجانبية للتنقل بين أقسام المحتوى</li>
              <li>• اضغط على أي قسم لعرض وإدارة بياناته</li>
              <li>• أضف عناصر جديدة من خلال زر "إضافة جديد" في كل قسم</li>
              <li>• عدل العناصر الحالية من خلال الضغط عليها في القوائم</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
