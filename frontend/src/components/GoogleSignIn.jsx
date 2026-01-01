import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { showToast } from '../utils/toast';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '870977434240-23qht0f9d7r6kn8n1nafcd0uddbf7sfd.apps.googleusercontent.com';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const GoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (window.google) return;

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    loadGoogleScript();
  }, []);

  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    try {
      // Decode the JWT token to get user info
      const userInfo = JSON.parse(atob(response.credential.split('.')[1]));

      // Create a user object with Google data
      const googleUser = {
        email: userInfo.email,
        firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || 'Google',
        lastName: userInfo.family_name || userInfo.name?.split(' ')[1] || 'User',
        picture: userInfo.picture
      };

      // Try to login with Google email (if user exists)
      // If not, we'll need to register them
      const result = await login({
        email: googleUser.email,
        password: '', // Google users don't have passwords
        isGoogleLogin: true,
        googleData: googleUser
      });

      if (result.success) {
        showToast.success(`Welcome ${googleUser.firstName}! 👋`);
        const from = location.state?.from?.pathname || '/doctors';
        navigate(from, { replace: true });
      } else {
        // If login fails, try to register the Google user
        const registerResult = await registerGoogleUser(googleUser);
        if (registerResult.success) {
          // Update auth context with new user
          const userData = registerResult.userData;
          await login({
            email: userData.email,
            password: '',
            isGoogleLogin: true,
            googleData: userData
          });

          showToast.success(`Account created! Welcome ${googleUser.firstName}! 🎉`);
          const from = location.state?.from?.pathname || '/doctors';
          navigate(from, { replace: true });
        } else {
          const errorMsg = registerResult.error || 'Failed to sign in with Google';
          showToast.error(errorMsg);
          console.error('Google registration failed:', registerResult);
        }
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      showToast.error('Failed to sign in with Google');
    }
    setIsLoading(false);
  };

  const registerGoogleUser = async (googleUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          password: '', // Empty password for Google users
          isGoogleUser: true
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store auth data consistently with AuthContext
        const userData = {
          id: data.userId,
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          role: data.role || 'USER',
          isAdmin: (data.role || 'USER') === 'ADMIN',
        };

        if (data.token) {
          localStorage.setItem('token', data.token); // Use consistent key
          localStorage.setItem('user', JSON.stringify(userData));
        }
        return { success: true, userData };
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error during registration' };
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt(); // Show the One Tap dialog
    } else {
      showToast.error('Google Sign-In not loaded');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full flex justify-center py-3 px-4 bg-white/70 backdrop-blur-md border-white/20 border text-primary-700 hover:bg-white/80 rounded-3xl shadow-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"
          />
          Signing in...
        </div>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </>
      )}
    </motion.button>
  );
};

export default GoogleSignIn;