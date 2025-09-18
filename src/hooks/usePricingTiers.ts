import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type PricingTier = Tables<'pricing_tiers'>;
export type PricingTierInsert = TablesInsert<'pricing_tiers'>;

export const usePricingTiers = (opts: { tripId?: string | number; experienceId?: string }) => {
  const { tripId, experienceId } = opts;
  return useQuery({
    queryKey: ['pricing_tiers', tripId || null, experienceId || null],
    queryFn: async () => {
      let query = supabase
        .from('pricing_tiers')
        .select('*')
        .order('sort_order', { ascending: true });

      if (tripId !== undefined && tripId !== null && tripId !== '') {
        const numId = typeof tripId === 'number' ? tripId : Number(tripId);
        query = query.eq('trip_id', numId);
      }
      if (experienceId) query = query.eq('experience_id', experienceId);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as PricingTier[];
    },
    enabled: Boolean(tripId || experienceId),
    staleTime: 1000 * 60 * 5,
  });
};

export const createPricingTier = async (payload: PricingTierInsert) => {
  const coerceTrip = (v: any): number | null => {
    if (v === undefined || v === null || v === '') return null;
    return typeof v === 'number' ? v : Number(v);
  };
  const { data, error } = await supabase
    .from('pricing_tiers')
    .insert([{ ...payload, trip_id: coerceTrip((payload as any).trip_id), price: Number(payload.price) }])
    .select('*')
    .single();
  if (error) throw error;
  return data as PricingTier;
};

export const updatePricingTier = async (id: string, payload: Partial<PricingTier>) => {
  const coerceTrip = (v: any): number | null => {
    if (v === undefined || v === null || v === '') return null;
    return typeof v === 'number' ? v : Number(v);
  };
  const { data, error } = await supabase
    .from('pricing_tiers')
    .update({ ...payload, trip_id: coerceTrip((payload as any).trip_id), price: payload.price !== undefined ? Number(payload.price) : undefined })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as PricingTier;
};

export const deletePricingTier = async (id: string) => {
  const { error } = await supabase.from('pricing_tiers').delete().eq('id', id);
  if (error) throw error;
  return true;
};
