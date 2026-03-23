// hooks/useAxiosSecure.js
import { useEffect } from 'react';
import axios from 'axios';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const useAxiosSecure = () => {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async user => {
      if (user) {
        const token = await user.getIdToken();
        axiosSecure.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        // ✅ You can log it for debug
        console.log('✅ Firebase token set in header:', token);
      } else {
        delete axiosSecure.defaults.headers.common['Authorization'];
        console.warn('⚠️ No user - token removed');
      }
    });

    return () => unsubscribe();
  }, []);

  return axiosSecure;
};

export default useAxiosSecure;
