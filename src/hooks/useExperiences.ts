
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration?: string;
  price: string;
}

export const useExperiences = () => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('id, title, description, image, category, duration, price')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Experience[];
    },
  });
};
