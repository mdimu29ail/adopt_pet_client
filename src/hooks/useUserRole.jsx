import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import { supabase } from '../Supabase/supabase.config';

const useUserRole = () => {
  const { user, loading } = useAuth();

  const { data: role, isLoading: roleLoading, error } = useQuery({
    queryKey: [user?.email, 'userRole'],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      console.log('Fetching role from Supabase for:', user.email);
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', user.email)
        .single();
      
      if (error) {
        console.error('Supabase Role Fetch Error:', error);
        throw error;
      }
      console.log('Supabase Role Response:', data?.role);
      return data?.role;
    },
    staleTime: 1000 * 60 * 5, // Cache role for 5 minutes
  });

  if (error) {
    console.error('Role Fetch Error:', error);
  }

  return [role, roleLoading];
};

export default useUserRole;
