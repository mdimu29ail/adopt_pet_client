import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Supabase/supabase.config';

const axiosSecure = axios.create({
  baseURL: 'https://pet-adopton-sarver.vercel.app',
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    async config => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  axiosSecure.interceptors.response.use(
    response => response,
    async error => {
      if (error.response.status === 401 || error.response.status === 403) {
        await supabase.auth.signOut();
        navigate('/login');
      }
      return Promise.reject(error);
    },
  );

  return axiosSecure;
};

export default useAxiosSecure;
