import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { useTrips } from '@/hooks/useTrips';
import { Badge } from '@/components/ui/badge';
import TripForm from './TripForm';
import { useToast } from '@/hooks/use-toast';

export function TripsManager() {
  const { data: trips = [], isLoading, refetch } = useTrips();
  const { toast } = useToast();
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState<any>(null);
  const [deleting, setDeleting] = React.useState(false);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };
  const handleEdit = (trip: any) => {
    setEditData(trip);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذه الرحلة؟')) return;
    setDeleting(true);
    try {
      const { error } = await import('@/integrations/supabase/client').then(({ supabase }) =>
        supabase.from('trips').delete().eq('id', id)
      );
      if (error) throw error;
      toast({ title: 'Deleted', description: 'تم حذف الرحلة بنجاح' });
      refetch();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading trips...</div>;
  }

  return (
    <div className="space-y-6 m-[25px]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">إدارة الرحلات السياحية</h2>
        <Button className="bg-pharaoh-600 hover:bg-pharaoh-700" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة رحلة جديدة
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <TripForm
              initialData={editData}
              onSuccess={() => {
                setShowForm(false);
                setEditData(null);
                refetch();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditData(null);
              }}
            />
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowForm(false)}>&times;</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={trip.image_url}
                alt={trip.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white" onClick={() => handleEdit(trip)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="destructive" className="bg-red-500/90 hover:bg-red-600" onClick={() => handleDelete(trip.id)} disabled={deleting}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {new Date(trip.start_date).toLocaleDateString('ar-EG')} - {new Date(trip.end_date).toLocaleDateString('ar-EG')}
                </span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{trip.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{trip.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500">السعر:</span>
                  <Badge variant="secondary" className="text-xs">
                    {trip.price.toLocaleString('ar-EG')} جنيه مصري
                  </Badge>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">الوجهة:</span>
                  <div className="text-xs text-gray-600 mt-1">
                    {trip.destinations?.name || trip.destination_id} - {trip.destinations?.region || ''}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {trips.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد رحلات بعد</h3>
            <p className="text-gray-500 mb-4">ابدأ بإضافة أول رحلة سياحية</p>
            <Button className="bg-pharaoh-600 hover:bg-pharaoh-700" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة أول رحلة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 