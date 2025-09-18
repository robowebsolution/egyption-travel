import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useDestinations } from '@/hooks/useDestinations';

interface TripFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TripForm({ initialData, onSuccess, onCancel }: TripFormProps) {
  const { toast } = useToast();
  const { data: destinations = [], isLoading: destinationsLoading } = useDestinations();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    destination_id: initialData?.destination_id || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
    end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
    image_url: initialData?.image_url || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDestinationChange = (value: string) => {
    setForm({ ...form, destination_id: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...form,
        price: parseFloat(form.price),
      };
      let res;
      if (initialData?.id) {
        res = await (supabase as any).from('trips').update(dataToSend).eq('id', initialData.id);
      } else {
        res = await (supabase as any).from('trips').insert([dataToSend]);
      }
      if (res.error) throw res.error;
      toast({ title: 'نجاح', description: 'تم حفظ الرحلة بنجاح', });
      onSuccess();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.message, });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <Input name="name" placeholder="اسم الرحلة" value={form.name} onChange={handleChange} required />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">الوجهة السياحية</label>
        <Select value={form.destination_id} onValueChange={handleDestinationChange} disabled={destinationsLoading}>
          <SelectTrigger>
            <SelectValue placeholder="اختر الوجهة السياحية" />
          </SelectTrigger>
          <SelectContent>
            {destinations.map((destination) => (
              <SelectItem key={destination.id} value={destination.id}>
                {destination.name} - {destination.region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Input name="price" type="number" placeholder="السعر" value={form.price} onChange={handleChange} required />
      <Input name="start_date" type="date" placeholder="تاريخ البداية" value={form.start_date} onChange={handleChange} required />
      <Input name="end_date" type="date" placeholder="تاريخ النهاية" value={form.end_date} onChange={handleChange} required />
      <Input name="image_url" placeholder="رابط الصورة (يفضل 1200x800)" value={form.image_url} onChange={handleChange} required />
      {form.image_url && (
        <img
          src={form.image_url || 'https://placehold.co/600x400?text=No+Image'}
          alt="معاينة الصورة"
          className="w-full h-40 object-cover rounded-md bg-gray-100"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
          }}
        />
      )}
      <Textarea name="description" placeholder="وصف الرحلة" value={form.description} onChange={handleChange} required />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>إلغاء</Button>
        <Button type="submit" disabled={loading}>{loading ? 'جاري الحفظ...' : (initialData?.id ? 'تحديث' : 'إضافة الرحلة')}</Button>
      </div>
    </form>
  );
} 