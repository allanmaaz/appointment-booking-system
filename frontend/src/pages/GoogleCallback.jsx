import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallback = () => {
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Check for error in URL params
        const errorParam = searchParams.get('error');
        if (errorParam) {
          let errorMessage = 'Google authentication failed.';
          switch (errorParam) {
            case 'no_email':
              errorMessage = 'Google did not provide an email address.';
              break;
            case 'oauth_failed':
              errorMessage = 'OAuth authentication failed.';
              break;
            case 'oauth_error':
              errorMessage = 'OAuth provider error.';
              break;
            default:
              errorMessage = 'Google authentication failed.';
          }
          throw new Error(errorMessage);
        }

        // Get data from URL params
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const firstName = searchParams.get('firstName');
        const lastName = searchParams.get('lastName');
        const userId = searchParams.get('userId');
        const role = searchParams.get('role');

        if (!token || !email) {
          throw new Error('Missing authentication data');
        }

        const userData = {
          id: parseInt(userId),
          email,
          firstName,
          lastName,
          role: role || 'USER',
          isAdmin: role === 'ADMIN',
        };

        // Save the token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Update auth context
        setUser(userData);
        setIsAuthenticated(true);

        // Redirect to doctors page
        navigate('/doctors', { replace: true });
      } catch (error) {
        console.error('Google OAuth error:', error);
        setError(error.message || 'Google authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleGoogleCallback();
  }, [navigate, setUser, setIsAuthenticated, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Authentication Failed</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <div className="text-sm text-gray-500">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <div className="text-white text-xl">Completing Google Sign In...</div>
        <div className="text-gray-400">Please wait while we log you in.</div>
      </div>
    </div>
  );
};

export default GoogleCallback;