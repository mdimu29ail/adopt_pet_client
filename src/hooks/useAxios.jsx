import axios from 'axios';

const axiosPublic = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'https://pet-adopton-sarver.vercel.app', // আপনার ব্যাকএন্ড ইউআরএল
});

const useAxios = () => {
  return axiosPublic;
};

export default useAxios;
