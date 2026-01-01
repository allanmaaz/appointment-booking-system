import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Calendar, MapPin, Settings, LogOut, Menu, X, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_CONSTANTS } from '../utils/constants';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/doctors', label: 'Doctors', icon: Stethoscope },
    { path: '/appointments', label: 'My Appointments', icon: Calendar },
    { path: '/map', label: 'Map View', icon: MapPin },
    { path: '/admin', label: 'Admin Dashboard', icon: Settings },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white/70 backdrop-blur-md border-white/20 border-b sticky top-0 z-50 relative overflow-hidden"
      >
        {/* Glass shine effect */}
        <div
          className="absolute inset-0 animate-glass-shine pointer-events-none opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link
                to="/doctors"
                className="flex items-center text-lg sm:text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                <div className="p-1.5 sm:p-2 bg-primary-100/80 rounded-2xl mr-2 sm:mr-3 shadow-lg">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" strokeWidth={1.5} />
                </div>
                <span className="hidden xs:inline">{APP_CONSTANTS.APP_NAME}</span>
                <span className="xs:hidden">ABS</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="ml-6 lg:ml-10 flex items-baseline space-x-1 lg:space-x-2">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Link
                        to={link.path}
                        className="group relative"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`px-3 lg:px-4 py-2 lg:py-2.5 rounded-2xl text-xs lg:text-sm font-medium transition-all duration-300 flex items-center ${
                            isActivePath(link.path)
                              ? 'bg-primary-500 text-white shadow-lg'
                              : 'text-primary-700 hover:bg-primary-50 hover:text-primary-800'
                          }`}
                        >
                          <Icon className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" strokeWidth={1.5} />
                          <span className="hidden lg:inline">{link.label}</span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <motion.div
                className="hidden md:flex items-center text-sm text-primary-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-1.5 bg-primary-100/80 rounded-xl mr-2">
                  <User className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
                </div>
                <span className="font-medium text-xs sm:text-sm">Welcome, {user?.firstName}</span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-600 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 border border-red-200/50 backdrop-blur-sm flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
              >
                <LogOut className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" strokeWidth={1.5} />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 bg-primary-100/80 rounded-2xl text-primary-600 hover:text-primary-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 sm:w-5 h-4 sm:h-5" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-4 sm:w-5 h-4 sm:h-5" strokeWidth={1.5} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="lg:hidden bg-white/70 backdrop-blur-md border-white/20 border-b relative overflow-hidden"
          >
            {/* Glass shine effect */}
            <div
              className="absolute inset-0 animate-glass-shine pointer-events-none opacity-30"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              }}
            />

            <div className="px-3 sm:px-4 pt-2 pb-3 space-y-1 sm:space-y-2 relative z-10">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base font-medium transition-all duration-300 flex items-center ${
                          isActivePath(link.path)
                            ? 'bg-primary-500 text-white shadow-lg'
                            : 'text-primary-700 hover:bg-primary-50 hover:text-primary-800'
                        }`}
                      >
                        <Icon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" strokeWidth={1.5} />
                        {link.label}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile User Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: navLinks.length * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                className="mt-4 pt-4 border-t border-primary-200/30"
              >
                <div className="flex items-center text-xs sm:text-sm text-primary-700 px-3 sm:px-4 py-2 bg-primary-50/80 rounded-2xl">
                  <div className="p-1 sm:p-1.5 bg-primary-100/80 rounded-xl mr-2 sm:mr-3">
                    <User className="w-3 sm:w-4 h-3 sm:h-4 text-primary-600" strokeWidth={1.5} />
                  </div>
                  <span className="font-medium">Welcome, {user?.firstName}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-40 bg-primary-900/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;