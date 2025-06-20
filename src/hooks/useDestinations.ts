
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Destination {
  id: string;
  name: string;
  region: string;
  activities: string[];
  image: string;
  description: string;
  highlights: string[];
}

export const useDestinations = () => {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Destination[];
    },
  });
};
