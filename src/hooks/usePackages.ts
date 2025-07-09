
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Package {
  id: string;
  title: string;
  description: string;
  duration: string;
  group_size: string;
  rating: number;
  price: string;
  image: string;
  highlights: string[];
}

export const usePackages = () => {
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Package[];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
