import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface DestinationFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DestinationForm({ initialData, onSuccess, onCancel }: DestinationFormProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    region: initialData?.region || '',
    activities: initialData?.activities?.join(', ') || '',
    image: initialData?.image || '',
    description: initialData?.description || '',
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
        activities: form.activities.split(',').map((a) => a.trim()),
        highlights: form.highlights.split(',').map((h) => h.trim()),
      };
      let res;
      if (initialData?.id) {
        res = await supabase.from('destinations').update(dataToSend).eq('id', initialData.id);
      } else {
        res = await supabase.from('destinations').insert([dataToSend]);
      }
      if (res.error) throw res.error;
      toast({ title: 'نجاح', description: 'تم حفظ الوجهة بنجاح', });
      onSuccess();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.message, });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <Input name="name" placeholder="اسم الوجهة" value={form.name} onChange={handleChange} required />
      <Input name="region" placeholder="المنطقة" value={form.region} onChange={handleChange} required />
      <Input name="activities" placeholder="الأنشطة (افصل بينها بفاصلة)" value={form.activities} onChange={handleChange} />
      <Input name="image" placeholder="رابط الصورة" value={form.image} onChange={handleChange} required />
      <Textarea name="description" placeholder="وصف الوجهة" value={form.description} onChange={handleChange} required />
      <Input name="highlights" placeholder="مميزات الوجهة (افصل بينها بفاصلة)" value={form.highlights} onChange={handleChange} />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>إلغاء</Button>
        <Button type="submit" loading={loading}>{initialData?.id ? 'تحديث' : 'إضافة الوجهة'}</Button>
      </div>
    </form>
  );
}
