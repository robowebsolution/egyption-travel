
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Heart, Clock, DollarSign } from 'lucide-react';
import { useExperiences } from '@/hooks/useExperiences';
import { Badge } from '@/components/ui/badge';
import ExperienceForm from './ExperienceForm';
import { useToast } from '@/hooks/use-toast';
import { formatUSD } from '@/lib/currency';
import PricingTiersEditor from './PricingTiersEditor';

export function ExperiencesManager() {
  const { data: experiences = [], isLoading, refetch } = useExperiences();
  const { toast } = useToast();
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState<any>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [showPricing, setShowPricing] = React.useState(false);
  const [pricingExpId, setPricingExpId] = React.useState<string | null>(null);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };
  const handleEdit = (experience: any) => {
    setEditData(experience);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذه التجربة؟')) return;
    setDeleting(true);
    try {
      const { error } = await import('@/integrations/supabase/client').then(({ supabase }) =>
        supabase.from('experiences').delete().eq('id', id)
      );
      if (error) throw error;
      toast({ title: 'Deleted', description: 'تم حذف التجربة بنجاح' });
      refetch();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading experiences...</div>;
  }

  return (
    <div className="space-y-6 m-[25px]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">إدارة التجارب السياحية</h2>
        <Button className="bg-pharaoh-600 hover:bg-pharaoh-700" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة تجربة جديدة
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <ExperienceForm
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
        {experiences.map((experience) => (
          <Card key={experience.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={experience.image || 'https://placehold.co/600x400?text=No+Image'}
                alt={experience.title}
                className="w-full h-48 object-cover rounded-t-lg bg-gray-100"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                }}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white" onClick={() => handleEdit(experience)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white" onClick={() => { setPricingExpId(experience.id); setShowPricing(true); }} title="الأسعار">
                  <DollarSign className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="destructive" className="bg-red-500/90 hover:bg-red-600" onClick={() => handleDelete(experience.id)} disabled={deleting}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="absolute top-2 left-2">
                <Badge className="bg-pharaoh-600 text-white">
                  {experience.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{experience.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{experience.description}</p>
              <div className="flex items-center justify-between text-sm">
                {experience.duration && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{experience.duration}</span>
                  </div>
                )}
                {experience.price && (
                  <div className="flex items-center gap-1 text-green-600 font-medium">
                    <DollarSign className="w-3 h-3" />
                    <span>{formatUSD(experience.price)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تجارب بعد</h3>
            <p className="text-gray-500 mb-4">ابدأ بإضافة أول تجربة سياحية</p>
            <Button className="bg-pharaoh-600 hover:bg-pharaoh-700" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة أول تجربة
            </Button>
          </CardContent>
        </Card>
      )}

      {showPricing && pricingExpId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-3xl relative">
            <PricingTiersEditor experienceId={pricingExpId} onClose={() => { setShowPricing(false); setPricingExpId(null); }} />
          </div>
        </div>
      )}
    </div>
  );
}
