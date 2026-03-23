import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

import {
  GithubAuthProvider,
  fetchSignInMethodsForEmail,
  signInWithPopup,
} from 'firebase/auth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { auth } from '../firebase/firebase.config';

const GithubLogin = () => {
  const [loading, setLoading] = useState(false);
  const githubProvider = new GithubAuthProvider();
  const navigate = useNavigate();

  const handleGithubLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, githubProvider);

      Swal.fire('Success', 'Logged in with GitHub!', 'success');
      navigate('/'); // Redirect to home page or dashboard here
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);

        const providerNames = {
          'google.com': 'Google',
          password: 'Email/Password',
          'facebook.com': 'Facebook',
          'github.com': 'GitHub',
        };

        const readableProviders = methods
          .map(m => providerNames[m] || m)
          .join(', ');

        Swal.fire({
          icon: 'info',
          title: 'Account Exists',
          html: `
            An account already exists with the same email address but different sign-in credentials.<br/>
            Please sign in using: <strong>${readableProviders}</strong>.<br/>
            After that, you can link your GitHub login from your profile settings.
          `,
        });
      } else {
        Swal.fire('Error', error.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGithubLogin}
      disabled={loading}
      className="flex items-center justify-center w-full p-3 space-x-4 border rounded-full border-orange-500 hover:border-orange-800 hover:bg-orange-800  bg-orange-500 transition-colors "
    >
      <FaGithub size="30px" />{' '}
      <p>{loading ? 'Signing in...' : 'Sign in with GitHub'}</p>
    </button>
  );
};

export default GithubLogin;
