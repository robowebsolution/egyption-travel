
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Star, MessageSquare } from 'lucide-react';
import { useTestimonials } from '@/hooks/useTestimonials';
import TestimonialForm from './TestimonialForm';
import { useToast } from '@/hooks/use-toast';

export function TestimonialsManager() {
  const { data: testimonials = [], isLoading, refetch } = useTestimonials();
  const { toast } = useToast();
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState<any>(null);
  const [deleting, setDeleting] = React.useState(false);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };
  const handleEdit = (testimonial: any) => {
    setEditData(testimonial);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا الرأي؟')) return;
    setDeleting(true);
    try {
      const { error } = await import('@/integrations/supabase/client').then(({ supabase }) =>
        supabase.from('testimonials').delete().eq('id', id)
      );
      if (error) throw error;
      toast({ title: 'Deleted', description: 'تم حذف الرأي بنجاح' });
      refetch();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">إدارة آراء العملاء</h2>
        <Button className="bg-pharaoh-600 hover:bg-pharaoh-700" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة رأي جديد
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <TestimonialForm
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
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleEdit(testimonial)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500 hover:text-red-600" onClick={() => handleDelete(testimonial.id)} disabled={deleting}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <blockquote className="text-gray-600 text-sm mb-4 italic line-clamp-3">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center gap-3">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{testimonial.name}</p>
                  <p className="text-xs text-gray-500 truncate">{testimonial.location}</p>
                  <p className="text-xs text-pharaoh-600 font-medium truncate">{testimonial.trip}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد آراء بعد</h3>
            <p className="text-gray-500 mb-4">ابدأ بإضافة أول رأي عميل</p>
            <Button className="bg-pharaoh-600 hover:bg-pharaoh-700" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة أول رأي
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
