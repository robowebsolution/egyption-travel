import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface HeroImage {
  id: string;
  url: string;
  alt: string | null;
  order_index: number;
}

const HeroSectionEditor: React.FC = () => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .order('order_index', { ascending: true });
    if (!error && data) setImages(data);
    setLoading(false);
  };

  const addImage = async () => {
    if (!newUrl) return;
    const maxOrder = images.length > 0 ? Math.max(...images.map(img => img.order_index)) : 0;
    await supabase.from('hero_images').insert({
      url: newUrl,
      alt: newAlt || null,
      order_index: maxOrder + 1
    });
    setNewUrl('');
    setNewAlt('');
    fetchImages();
  };

  const updateImage = async (id: string, url: string, alt: string | null, order_index: number) => {
    await supabase.from('hero_images').update({ url, alt, order_index }).eq('id', id);
    fetchImages();
  };

  const deleteImage = async (id: string) => {
    await supabase.from('hero_images').delete().eq('id', id);
    fetchImages();
  };

  const moveImage = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === images.length - 1)) return;
    const newImages = [...images];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    // Swap order_index
    const temp = newImages[index].order_index;
    newImages[index].order_index = newImages[swapIndex].order_index;
    newImages[swapIndex].order_index = temp;
    // Update both in DB
    await Promise.all([
      supabase.from('hero_images').update({ order_index: newImages[index].order_index }).eq('id', newImages[index].id),
      supabase.from('hero_images').update({ order_index: newImages[swapIndex].order_index }).eq('id', newImages[swapIndex].id)
    ]);
    fetchImages();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">تعديل صور الهيرو سيكشن</h2>
      {loading ? (
        <div>جاري التحميل...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {images.map((img, idx) => (
              <div key={img.id} className="bg-white/10 border border-pharaoh-100 rounded-lg shadow p-3 flex flex-col items-center relative group">
                <img src={img.url} alt={img.alt || ''} className="w-full h-32 object-cover rounded mb-2" />
                <input
                  type="text"
                  value={img.url}
                  onChange={e => {
                    const val = e.target.value;
                    setImages(prev => prev.map(im => im.id === img.id ? { ...im, url: val } : im));
                  }}
                  className="w-full px-2 py-1 border rounded mb-1 text-xs"
                  placeholder="رابط الصورة"
                />
                <input
                  type="text"
                  value={img.alt || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setImages(prev => prev.map(im => im.id === img.id ? { ...im, alt: val } : im));
                  }}
                  className="w-full px-2 py-1 border rounded mb-2 text-xs"
                  placeholder="alt نص بديل"
                />
                <div className="flex gap-2 w-full justify-between">
                  <Button size="sm" className="flex-1" onClick={() => updateImage(img.id, img.url, img.alt, img.order_index)}>
                    حفظ
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => deleteImage(img.id)}>
                    حذف
                  </Button>
                </div>
                <div className="flex gap-1 w-full mt-2">
                  <Button size="icon" onClick={() => moveImage(idx, 'up')} disabled={idx === 0}>
                    ↑
                  </Button>
                  <Button size="icon" onClick={() => moveImage(idx, 'down')} disabled={idx === images.length - 1}>
                    ↓
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white/10 border border-dashed border-pharaoh-200 rounded-lg p-4 flex flex-col items-center gap-2">
            <span className="font-semibold text-pharaoh-700 mb-2">إضافة صورة جديدة</span>
            <input
              type="text"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              className="w-full px-2 py-1 border rounded"
              placeholder="رابط صورة جديدة"
            />
            <input
              type="text"
              value={newAlt}
              onChange={e => setNewAlt(e.target.value)}
              className="w-full px-2 py-1 border rounded"
              placeholder="alt نص بديل (اختياري)"
            />
            <Button onClick={addImage} className="w-full">إضافة</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSectionEditor;
