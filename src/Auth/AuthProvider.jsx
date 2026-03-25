import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../Supabase/supabase.config';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ১. নতুন ইউজার তৈরি (Email/Password)
  const createUser = async (email, password, fullName, photoUrl) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: photoUrl,
        },
      },
    });
    return { data, error };
  };

  // ২. লগইন (Email/Password)
  const signIn = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  // ৩. সোশ্যাল লগইন (Google)
  const googleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // লগইন শেষে অ্যাপে ফিরবে
      },
    });
    return { data, error };
  };

  // ৪. প্রোফাইল আপডেট (Metadata update)
  const updateUserProfile = async (fullName, photoUrl) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: fullName, avatar_url: photoUrl },
    });
    return { data, error };
  };

  // ৫. লগআউট
  const logOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    }
    setLoading(false);
  };

  // ৬. ইউজার স্টেট অবজার্ভার (onAuthStateChange)
  useEffect(() => {
    // কারেন্ট সেশন চেক করা
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // সেশন পরিবর্তনের ওপর নজর রাখা (Login/Logout/Token Refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase Auth Event:', event);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session) {
        // টোকেন লোকাল স্টোরেজে রাখা (AxiosSecure এর জন্য)
        localStorage.setItem('access-token', session.access_token);
      } else {
        localStorage.removeItem('access-token');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    googleLogin,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
