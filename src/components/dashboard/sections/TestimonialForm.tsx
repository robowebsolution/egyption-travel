import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface TestimonialFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TestimonialForm({ initialData, onSuccess, onCancel }: TestimonialFormProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    trip: initialData?.trip || '',
    rating: initialData?.rating || '',
    content: initialData?.content || '',
    avatar: initialData?.avatar || '',
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
        rating: Number(form.rating),
      };
      let res;
      if (initialData?.id) {
        res = await supabase.from('testimonials').update(dataToSend).eq('id', initialData.id);
      } else {
        res = await supabase.from('testimonials').insert([dataToSend]);
      }
      if (res.error) throw res.error;
      toast({ title: 'نجاح', description: 'تم حفظ الرأي بنجاح', });
      onSuccess();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.message, });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <Input name="name" placeholder="اسم العميل" value={form.name} onChange={handleChange} required />
      <Input name="location" placeholder="المدينة/الدولة" value={form.location} onChange={handleChange} />
      <Input name="trip" placeholder="اسم الرحلة/الباقة" value={form.trip} onChange={handleChange} />
      <Input name="rating" placeholder="التقييم" type="number" value={form.rating} onChange={handleChange} required />
      <Textarea name="content" placeholder="نص الرأي/التعليق" value={form.content} onChange={handleChange} required />
      <Input name="avatar" placeholder="رابط صورة العميل" value={form.avatar} onChange={handleChange} />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>إلغاء</Button>
        <Button type="submit" loading={loading}>{initialData?.id ? 'تعديل الرأي' : 'إضافة الرأي'}</Button>
      </div>
    </form>
  );
}
