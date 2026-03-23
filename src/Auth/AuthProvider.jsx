import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { useEffect, useState } from 'react';

import axios from 'axios';
import { AuthContext } from './AuthContext';
import { auth } from '../Firebase/firebase.config';

const provider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState();

  const [user, setUser] = useState(null);
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signinWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  const updateUserProfile = profileInfo => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  const logOut = () => {
    setLoading(true);
    signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser?.email) {
        const userData = { email: currentUser.email };
        axios
          .post(
            'https://my-assignment-11-server-lac.vercel.app/jwt',
            userData,
            {
              withCredentials: true,
            }
          )
          .then(res => console.log('token', res.data))
          .catch(err => {
            console.log(err);
          });
      }
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const userInfo = {
    createUser,
    loading,
    logIn,
    signinWithGoogle,
    user,
    logOut,
    setLoading,
    updateUserProfile,
  };
  return <AuthContext value={userInfo}>{children}</AuthContext>;
};

export default AuthProvider;
