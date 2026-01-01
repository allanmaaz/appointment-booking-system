import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_CONSTANTS } from '../utils/constants';
import { showToast } from '../utils/toast';
import GoogleSignIn from '../components/GoogleSignIn';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/doctors';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(credentials);

    if (result.success) {
      showToast.success('Welcome back! 👋');
      const from = location.state?.from?.pathname || '/doctors';
      navigate(from, { replace: true });
    } else {
      setError(result.error);
      showToast.error(result.error);
    }

    setIsLoading(false);
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      showToast.error('Geolocation is not supported by this browser');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        // Get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=demo&pretty=1`
          );
          const data = await response.json();

          if (data.results && data.results[0]) {
            const { city, state, country } = data.results[0].components;
            setUserLocation({
              latitude,
              longitude,
              address: data.results[0].formatted,
              city,
              state,
              country
            });
            showToast.success(`Location detected: ${city || 'Your area'}`);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          showToast.success('Location detected successfully!');
        }

        setGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setGettingLocation(false);
        showToast.error('Could not get your location. Please enable location services.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100 to-accent-100 font-sans tracking-tight"
         style={{
           backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(0, 194, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(224, 242, 254, 0.3) 0%, transparent 50%)',
           backgroundSize: '100% 100%'
         }}>
      {/* Liquid Glass Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Water Bubble */}
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 opacity-20 animate-liquid blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 188, 212, 0.3) 0%, rgba(14, 165, 233, 0.2) 50%, transparent 100%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Medium Ripple Effect */}
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 opacity-15 animate-wave"
          style={{
            background: 'conic-gradient(from 0deg, rgba(0, 188, 212, 0.2), rgba(14, 165, 233, 0.3), rgba(0, 188, 212, 0.2))',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
          }}
          animate={{
            x: [0, -120, 0],
            y: [0, 60, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Small Glass Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-full opacity-25 animate-float"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(0, 188, 212, 0.4))',
              backdropFilter: 'blur(10px)',
              top: `${20 + (i * 15)}%`,
              left: `${10 + (i * 15)}%`,
              animationDelay: `${i * 0.5}s`
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mx-auto h-16 w-16 flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl shadow-2xl border-white/20 border"
            >
              <Sparkles className="text-3xl text-white" strokeWidth={1.5} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-3xl font-bold text-primary-800"
            >
              Welcome to {APP_CONSTANTS.APP_NAME}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-sm text-primary-700"
            >
              Sign in to explore nearby healthcare 💧
            </motion.p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -2 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.3
            }}
            className="bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Glass shine effect */}
            <div
              className="absolute inset-0 animate-glass-shine pointer-events-none"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              }}
            />
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium mb-2 text-primary-800">
                  <Mail className="inline w-4 h-4 mr-2" strokeWidth={1.5} />
                  Email Address
                </label>
                <motion.div
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-primary-900 placeholder-primary-600"
                    placeholder="john.doe@example.com"
                    value={credentials.email}
                    onChange={handleInputChange}
                  />
                </motion.div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium mb-2 text-primary-800">
                  <Lock className="inline w-4 h-4 mr-2" strokeWidth={1.5} />
                  Password
                </label>
                <motion.div
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    className="w-full px-4 py-3 pr-12 bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-primary-900 placeholder-primary-600"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={handleInputChange}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-3xl font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg group relative overflow-hidden"
                >
                  {/* Ripple effect */}
                  <div className="absolute inset-0 animate-ripple opacity-20 bg-white rounded-2xl pointer-events-none"></div>
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="rounded-full h-4 w-4 border-b-2 border-white mr-2"
                      />
                      Signing in...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign in
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                    </span>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary-300/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 backdrop-blur-sm rounded-full bg-white/50 text-primary-600">
                    Or continue with
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Google Login */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6"
            >
              <GoogleSignIn />
            </motion.div>

            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-primary-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium transition-colors text-primary-600 hover:text-primary-700"
                >
                  Create one now
                </Link>
              </p>
            </motion.div>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-6 text-center"
            >
              <div className="text-sm text-primary-600">
                Demo credentials:
                <br />
                <span className="font-mono text-xs px-3 py-1 rounded-lg mt-2 inline-block backdrop-blur-sm bg-white/30 border border-primary-300/20 text-primary-700">
                  john.doe@email.com / test123
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Location Button */}
      <motion.button
        whileHover={{ scale: 1.1, y: -1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed top-4 right-4 p-3 bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl shadow-lg transition-all text-primary-800"
        onClick={getCurrentLocation}
        disabled={gettingLocation}
        title={userLocation ? `Location: ${userLocation.city || 'Detected'}` : 'Get current location'}
      >
        {gettingLocation ? '🔄' : userLocation ? '🟢' : '📍'}
      </motion.button>
    </div>
  );
};

export default Login;