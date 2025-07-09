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
}

export const useTrips = (destinationId?: string) => {
  return useQuery({
    queryKey: ['trips', destinationId],
    queryFn: async () => {
      let query = supabase.from('trips').select(`
        *,
        destinations (
          id,
          name,
          region
        )
      `);
      if (destinationId) {
        query = query.eq('destination_id', destinationId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as (Trip & { destinations: { id: string; name: string; region: string } })[];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
