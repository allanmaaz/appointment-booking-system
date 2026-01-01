import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, Stethoscope, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_CONSTANTS } from '../utils/constants';
import { showToast } from '../utils/toast';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/doctors', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      if (response.ok) {
        // Auto-login after registration
        const loginResult = await register({
          email: formData.email,
          password: formData.password
        });

        if (loginResult.success) {
          showToast.success('Welcome to our platform! 🎉');
          navigate('/doctors', { replace: true });
        } else {
          showToast.success('Registration successful! Please log in.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        const errorData = await response.text();
        const errorMessage = errorData || 'Registration failed';
        setError(errorMessage);
        showToast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      showToast.error(errorMessage);
    }

    setIsLoading(false);
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
              right: `${10 + (i * 15)}%`,
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
          className="max-w-lg w-full space-y-8"
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
              <UserPlus className="text-white" size={28} strokeWidth={1.5} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-3xl font-bold text-primary-800"
            >
              Join {APP_CONSTANTS.APP_NAME}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-sm text-primary-700"
            >
              Create your account to start booking appointments ✨
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
                  className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl backdrop-blur-sm text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium mb-2 text-primary-800">
                    <User className="inline w-4 h-4 mr-2" strokeWidth={1.5} />
                    First Name
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <input
                      name="firstName"
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-primary-900 placeholder-primary-600"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium mb-2 text-primary-800">
                    <User className="inline w-4 h-4 mr-2" strokeWidth={1.5} />
                    Last Name
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <input
                      name="lastName"
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-primary-900 placeholder-primary-600"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium mb-2 text-primary-800">
                  <Mail className="inline w-4 h-4 mr-2" strokeWidth={1.5} />
                  Email Address
                </label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-primary-900 placeholder-primary-600"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </motion.div>
              </motion.div>

              {/* Role Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
              >
                <label className="block text-sm font-medium mb-3 text-primary-800">
                  <Users className="inline w-4 h-4 mr-2" strokeWidth={1.5} />
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'USER' }))}
                    className={`cursor-pointer p-4 rounded-3xl border transition-all duration-300 ${
                      formData.role === 'USER'
                        ? 'bg-primary-100/80 border-primary-500 text-primary-700 backdrop-blur-md'
                        : 'bg-white/50 border-white/30 text-primary-700 hover:bg-white/70 backdrop-blur-md'
                    }`}
                  >
                    <div className="text-center">
                      <User className="mx-auto mb-2" size={24} strokeWidth={1.5} />
                      <div className="font-medium">Patient</div>
                      <div className="text-xs opacity-75">Book appointments</div>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'DOCTOR' }))}
                    className={`cursor-pointer p-4 rounded-3xl border transition-all duration-300 ${
                      formData.role === 'DOCTOR'
                        ? 'bg-primary-100/80 border-primary-500 text-primary-700 backdrop-blur-md'
                        : 'bg-white/50 border-white/30 text-primary-700 hover:bg-white/70 backdrop-blur-md'
                    }`}
                  >
                    <div className="text-center">
                      <Stethoscope className="mx-auto mb-2" size={24} strokeWidth={1.5} />
                      <div className="font-medium">Doctor</div>
                      <div className="text-xs opacity-75">Provide healthcare</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3 pr-12 bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-primary-900 placeholder-primary-600"
                    placeholder="••••••••"
                    value={formData.password}
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

              {/* Confirm Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-medium mb-2 text-primary-800">
                  <Lock className="inline w-4 h-4 mr-2" strokeWidth={1.5} />
                  Confirm Password
                </label>
                <motion.div
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3 pr-12 bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-primary-900 placeholder-primary-600"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
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
                  <div className="absolute inset-0 animate-ripple opacity-20 bg-white rounded-3xl pointer-events-none"></div>
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="rounded-full h-4 w-4 border-b-2 border-white mr-2"
                      />
                      Creating Account...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Create Account
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
              transition={{ delay: 1.0 }}
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
              transition={{ delay: 1.1 }}
              className="mt-6"
            >
              <motion.a
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                href="http://localhost:8080/oauth2/authorization/google"
                className="w-full flex justify-center py-3 px-4 bg-white/70 backdrop-blur-md border-white/20 border text-primary-700 hover:bg-white/80 rounded-3xl shadow-lg text-sm font-medium transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </motion.a>
            </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-primary-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium transition-colors text-primary-600 hover:text-primary-700"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;