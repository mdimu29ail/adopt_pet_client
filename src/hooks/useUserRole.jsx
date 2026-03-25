import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxios from './useAxios'; // নিশ্চিত হোন এটি আপনার public axios

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxios(); // Public axios ব্যবহার করুন যেহেতু এই রুটটি ওপেন

  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: [user?.email, 'userRole'],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/role/${user.email}`);
      console.log('Frontend Role Check:', res.data.role); // কনসোলে দেখুন কী আসছে
      return res.data.role;
    },
  });

  return [role, roleLoading];
};

export default useUserRole;
