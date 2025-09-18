import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Removed season select: simplified pricing to people_count + price only
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, DollarSign } from 'lucide-react';
import { usePricingTiers, createPricingTier, updatePricingTier, deletePricingTier, PricingTier } from '@/hooks/usePricingTiers';
import { formatUSD } from '@/lib/currency';

interface Props {
  tripId?: string | number;
  experienceId?: string;
  onClose: () => void;
}

const emptyNew = {
  people_count: undefined as number | undefined,
  price: undefined as number | undefined,
  sort_order: undefined as number | undefined,
};

const PricingTiersEditor: React.FC<Props> = ({ tripId, experienceId, onClose }) => {
  const { data: tiers = [], refetch, isLoading } = usePricingTiers({ tripId, experienceId });
  const [adding, setAdding] = useState(false);
  const [newTier, setNewTier] = useState<typeof emptyNew>(emptyNew);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Partial<PricingTier>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const title = useMemo(() => (tripId ? 'إدارة أسعار الرحلة' : 'إدارة أسعار التجربة'), [tripId]);
  const hasTarget = useMemo(() => {
    const hasTrip = tripId !== undefined && tripId !== null && tripId !== '';
    const hasExp = experienceId !== undefined && experienceId !== null && experienceId !== '';
    return hasTrip || hasExp;
  }, [tripId, experienceId]);

  const nextSortOrder = () => {
    if (!tiers || tiers.length === 0) return 1;
    return Math.max(...tiers.map((t) => t.sort_order ?? 0)) + 1;
  };

  const handleAdd = async () => {
    if (newTier.people_count == null || newTier.people_count <= 0 || newTier.price == null) return;
    setSaving(true);
    try {
      const tripIdValue = (tripId !== undefined && tripId !== null && tripId !== '')
        ? (typeof tripId === 'number' ? tripId : Number(tripId))
        : null;
      const expIdValue = (experienceId !== undefined && experienceId !== null && experienceId !== '') ? experienceId : null;
      if (tripIdValue === null && expIdValue === null) {
        setSaving(false);
        return; // لا يوجد هدف مرتبط، لا نحاول الحفظ
      }
      await createPricingTier({
        trip_id: tripIdValue,
        experience_id: expIdValue,
        people_count: Number(newTier.people_count),
        price: Number(newTier.price),
        currency: 'USD',
        sort_order: Number(newTier.sort_order ?? nextSortOrder()),
      });
      setNewTier(emptyNew);
      setAdding(false);
      await refetch();
      setErrorMsg(null);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (row: PricingTier) => {
    setEditingId(row.id);
    setEditRow(row);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await updatePricingTier(editingId, {
        people_count: editRow.people_count ?? undefined,
        price: editRow.price,
        sort_order: editRow.sort_order,
      });
      setEditingId(null);
      setEditRow({});
      await refetch();
      setErrorMsg(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await deletePricingTier(id);
      await refetch();
      setErrorMsg(null);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to delete');
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button variant="ghost" onClick={onClose}><X className="w-4 h-4" /></Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Badge variant="secondary" className="gap-1"><DollarSign className="w-3 h-3" /> USD</Badge>
          <span>العملة المستخدمة في العرض</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-gray-700">
                <th className="px-2">عدد الأشخاص</th>
                <th className="px-2">السعر</th>
                <th className="px-2">الترتيب</th>
                <th className="px-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((t) => (
                <tr key={t.id} className="bg-white rounded">
                  <td className="px-2 py-1">
                    {editingId === t.id ? (
                      <Input
                        type="number"
                        value={editRow.people_count != null ? String(editRow.people_count) : ''}
                        onChange={(e) => setEditRow((r) => ({ ...r, people_count: e.target.value ? Number(e.target.value) : null }))}
                      />
                    ) : (
                      <span>{t.people_count ?? '-'}</span>
                    )}
                  </td>
                  <td className="px-2 py-1">
                    {editingId === t.id ? (
                      <Input
                        type="number"
                        value={editRow.price != null ? String(editRow.price) : ''}
                        onChange={(e) => setEditRow((r) => ({ ...r, price: e.target.value ? Number(e.target.value) : undefined }))}
                      />
                    ) : (
                      <span className="font-semibold">{formatUSD(t.price)}</span>
                    )}
                  </td>
                  <td className="px-2 py-1">
                    {editingId === t.id ? (
                      <Input
                        type="number"
                        value={editRow.sort_order != null ? String(editRow.sort_order) : ''}
                        onChange={(e) => setEditRow((r) => ({ ...r, sort_order: e.target.value ? Number(e.target.value) : 0 }))}
                      />
                    ) : (
                      <span>{t.sort_order}</span>
                    )}
                  </td>
                  <td className="px-2 py-1 flex gap-2">
                    {editingId === t.id ? (
                      <>
                        <Button size="sm" onClick={saveEdit} disabled={saving}>حفظ</Button>
                        <Button size="sm" variant="secondary" onClick={() => { setEditingId(null); setEditRow({}); }}>إلغاء</Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => startEdit(t)}>تعديل</Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(t.id)}>حذف</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {adding ? (
                <tr className="bg-white rounded">
                  <td className="px-2 py-1"><Input type="number" value={newTier.people_count != null ? String(newTier.people_count) : ''} onChange={(e) => setNewTier({ ...newTier, people_count: e.target.value ? Number(e.target.value) : undefined })} placeholder="1" /></td>
                  <td className="px-2 py-1"><Input type="number" value={newTier.price != null ? String(newTier.price) : ''} onChange={(e) => setNewTier({ ...newTier, price: e.target.value ? Number(e.target.value) : undefined })} placeholder="1200" /></td>
                  <td className="px-2 py-1"><Input type="number" value={newTier.sort_order != null ? String(newTier.sort_order) : ''} onChange={(e) => setNewTier({ ...newTier, sort_order: e.target.value ? Number(e.target.value) : undefined })} placeholder="1" /></td>
                  <td className="px-2 py-1 flex gap-2"><Button size="sm" onClick={handleAdd} disabled={saving || !hasTarget || newTier.people_count == null || newTier.people_count <= 0 || newTier.price == null}>حفظ</Button><Button size="sm" variant="secondary" onClick={() => { setAdding(false); setNewTier(emptyNew); }}>إلغاء</Button></td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {errorMsg && (<div className="text-sm text-red-600">{errorMsg}</div>)}
        {!adding && (
          <Button onClick={() => { setNewTier({ ...emptyNew, sort_order: nextSortOrder() }); setAdding(true); }} className="gap-1"><Plus className="w-4 h-4" /> إضافة صف</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingTiersEditor;
