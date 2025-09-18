import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface PackageFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PackageForm({ initialData, onSuccess, onCancel }: PackageFormProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    duration: initialData?.duration || '',
    group_size: initialData?.group_size || '',
    rating: initialData?.rating || '',
    price: initialData?.price || '',
    image: initialData?.image || '',
    highlights: initialData?.highlights?.join(', ') || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...form,
        highlights: form.highlights.split(',').map((h) => h.trim()),
        rating: Number(form.rating),
      };
      let res;
      if (initialData?.id) {
        res = await supabase.from('packages').update(dataToSend).eq('id', initialData.id);
      } else {
        res = await supabase.from('packages').insert([dataToSend]);
      }
      if (res.error) throw res.error;
      toast({ title: 'نجاح', description: 'تم حفظ الباقة بنجاح', });
      onSuccess();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.message, });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <Input name="title" placeholder="عنوان الباقة" value={form.title} onChange={handleChange} required />
      <Textarea name="description" placeholder="وصف الباقة" value={form.description} onChange={handleChange} required />
      <Input name="duration" placeholder="المدة" value={form.duration} onChange={handleChange} required />
      <Input name="group_size" placeholder="عدد الأفراد" value={form.group_size} onChange={handleChange} required />
      <Input name="rating" placeholder="التقييم" type="number" value={form.rating} onChange={handleChange} required />
      <Input name="price" placeholder="السعر" value={form.price} onChange={handleChange} required />
      <Input name="image" placeholder="رابط الصورة (يفضل 1200x800)" value={form.image} onChange={handleChange} required />
      {form.image && (
        <img
          src={form.image || 'https://placehold.co/600x400?text=No+Image'}
          alt="معاينة الصورة"
          className="w-full h-40 object-cover rounded-md bg-gray-100"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
          }}
        />
      )}
      <Input name="highlights" placeholder="مميزات الباقة (افصل بينها بفاصلة)" value={form.highlights} onChange={handleChange} />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>إلغاء</Button>
        <Button type="submit" disabled={loading}>{loading ? 'جاري الحفظ...' : (initialData?.id ? 'تحديث' : 'إضافة الباقة')}</Button>
      </div>
    </form>
  );
}
