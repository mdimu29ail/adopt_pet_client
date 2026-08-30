import axios from 'axios';

const axiosPublic = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    // 'http://localhost:5000' ||
    'https://pet-adopton-sarver.vercel.app',
});

const useAxios = () => {
  return axiosPublic;
};

export default useAxios;
