import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ExperienceFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ExperienceForm({ initialData, onSuccess, onCancel }: ExperienceFormProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    category: initialData?.category || '',
    duration: initialData?.duration || '',
    price: initialData?.price || '',
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
      };
      let res;
      if (initialData?.id) {
        res = await supabase.from('experiences').update(dataToSend).eq('id', initialData.id);
      } else {
        res = await supabase.from('experiences').insert([dataToSend]);
      }
      if (res.error) throw res.error;
      toast({ title: 'نجاح', description: 'تم حفظ التجربة بنجاح', });
      onSuccess();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.message, });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <Input name="title" placeholder="عنوان التجربة" value={form.title} onChange={handleChange} required />
      <Textarea name="description" placeholder="وصف التجربة" value={form.description} onChange={handleChange} required />
      <Input name="image" placeholder="رابط الصورة" value={form.image} onChange={handleChange} required />
      <Input name="category" placeholder="الفئة" value={form.category} onChange={handleChange} />
      <Input name="duration" placeholder="المدة" value={form.duration} onChange={handleChange} />
      <Input name="price" placeholder="السعر" value={form.price} onChange={handleChange} />
      <Input name="highlights" placeholder="مميزات التجربة (افصل بينها بفاصلة)" value={form.highlights} onChange={handleChange} />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>إلغاء</Button>
        <Button type="submit" loading={loading}>{initialData?.id ? 'تحديث' : 'إضافة التجربة'}</Button>
      </div>
    </form>
  );
}
