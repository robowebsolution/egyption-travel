import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Trip {
  id: string;
  destination_id: string;
  name: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  image_url: string;
  created_at: string;
  inclusions?: string[];
  exclusions?: string[];
  meeting_point?: string;
  things_to_remember?: string[];
  cancellation_policy?: string;
}

export const useTrip = (tripId?: string) => {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      if (!tripId) return null;
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();
      if (error) throw error;
      return data as Trip;
    },
    enabled: !!tripId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
