
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Package, Clock, Users, Star } from 'lucide-react';
import { usePackages } from '@/hooks/usePackages';
import { Badge } from '@/components/ui/badge';
import PackageForm from './PackageForm';
import { useToast } from '@/hooks/use-toast';

export function PackagesManager() {
  const { data: packages = [], isLoading, refetch } = usePackages();
  const { toast } = useToast();
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState<any>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };
  const handleEdit = (pkg: any) => {
    setEditData(pkg);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذه الباقة؟')) return;
    setDeleting(true);
    try {
      const { error } = await import('@/integrations/supabase/client').then(({ supabase }) =>
        supabase.from('packages').delete().eq('id', id)
      );
      if (error) throw error;
      toast({ title: 'Deleted', description: 'تم حذف الباقة بنجاح' });
      refetch();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading packages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">إدارة الباقات السياحية</h2>
        <Button className="bg-pharaoh-600 hover:bg-pharaoh-700" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة باقة جديدة
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <PackageForm
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
        {packages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white" onClick={() => handleEdit(pkg)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="destructive" className="bg-red-500/90 hover:bg-red-600" onClick={() => handleDelete(pkg.id)} disabled={deleting}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge className="bg-green-600 text-white font-bold">
                  {pkg.price}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{pkg.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pkg.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{pkg.group_size}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{pkg.rating}</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Highlights:</span>
                <div className="text-xs text-gray-600 mt-1">
                  {pkg.highlights.length} highlights included
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد باقات بعد</h3>
            <p className="text-gray-500 mb-4">ابدأ بإضافة أول باقة سياحية</p>
            <Button className="bg-pharaoh-600 hover:bg-pharaoh-700" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة أول باقة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
