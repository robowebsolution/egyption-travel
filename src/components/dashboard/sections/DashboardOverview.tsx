
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Package, Heart, Star, TrendingUp, Users } from 'lucide-react';
import { useDestinations } from '@/hooks/useDestinations';
import { usePackages } from '@/hooks/usePackages';
import { useExperiences } from '@/hooks/useExperiences';
import { useTestimonials } from '@/hooks/useTestimonials';

import { useNavigate } from 'react-router-dom';

export function DashboardOverview() {
  const { data: destinations } = useDestinations();
  const { data: packages } = usePackages();
  const { data: experiences } = useExperiences();
  const { data: testimonials } = useTestimonials();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'إجمالي الوجهات السياحية',
      value: destinations?.length || 0,
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'عدد الباقات السياحية',
      value: packages?.length || 0,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'عدد التجارب السياحية',
      value: experiences?.length || 0,
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'آراء العملاء',
      value: testimonials?.length || 0,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="space-y-6 m-[25px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
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
              <div className="flex items-center justify-between py-2 border-b">
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
  onClick={() => navigate('/dashboard?section=destinations')}
>
  <div className="font-medium text-gray-900">إضافة وجهة جديدة</div>
  <div className="text-sm text-gray-500">إنشاء وجهة سياحية جديدة</div>
</button>
              <button
  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
  onClick={() => navigate('/dashboard?section=packages')}
>
  <div className="font-medium text-gray-900">إضافة باقة جديدة</div>
  <div className="text-sm text-gray-500">إنشاء باقة سياحية جديدة</div>
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
