
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { useDestinations } from '@/hooks/useDestinations';
import { Badge } from '@/components/ui/badge';
import DestinationForm from './DestinationForm';
import { useToast } from '@/hooks/use-toast';

export function DestinationsManager() {
  const { data: destinations = [], isLoading, refetch } = useDestinations();
  const { toast } = useToast();
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState<any>(null);
  const [deleting, setDeleting] = React.useState(false);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };
  const handleEdit = (destination: any) => {
    setEditData(destination);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذه الوجهة؟')) return;
    setDeleting(true);
    try {
      const { error } = await import('@/integrations/supabase/client').then(({ supabase }) =>
        supabase.from('destinations').delete().eq('id', id)
      );
      if (error) throw error;
      toast({ title: 'Deleted', description: 'تم حذف الوجهة بنجاح' });
      refetch();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading destinations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">إدارة الوجهات السياحية</h2>
        <Button className="bg-pharaoh-600 hover:bg-pharaoh-700" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة وجهة جديدة
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <DestinationForm
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
        {destinations.map((destination) => (
          <Card key={destination.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white" onClick={() => handleEdit(destination)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="destructive" className="bg-red-500/90 hover:bg-red-600" onClick={() => handleDelete(destination.id)} disabled={deleting}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">{destination.region}</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{destination.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{destination.description}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-500">Activities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {destination.activities.slice(0, 3).map((activity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                    {destination.activities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{destination.activities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Highlights:</span>
                  <div className="text-xs text-gray-600 mt-1">
                    {destination.highlights.length} highlights
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {destinations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد وجهات بعد</h3>
            <p className="text-gray-500 mb-4">ابدأ بإضافة أول وجهة سياحية</p>
            <Button className="bg-pharaoh-600 hover:bg-pharaoh-700" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة أول وجهة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
