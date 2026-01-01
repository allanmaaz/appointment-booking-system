import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, AlertCircle, Clipboard, Users, ChevronRight } from 'lucide-react';
import { appointmentAPI } from '../api/api';
import AppointmentCard from '../components/AppointmentCard';
import Navigation from '../components/Navigation';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getUserAppointments();
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentAPI.cancelAppointment(appointmentId);
      // Refresh appointments
      fetchAppointments();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const filterAppointments = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
      case 'upcoming':
        return appointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= today && apt.status === 'BOOKED';
        });
      case 'past':
        return appointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate < today || apt.status !== 'BOOKED';
        });
      default:
        return appointments;
    }
  };

  const getFilteredAppointments = (filterType) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filterType) {
      case 'upcoming':
        return appointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= today && apt.status === 'BOOKED';
        });
      case 'past':
        return appointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate < today || apt.status !== 'BOOKED';
        });
      default:
        return appointments;
    }
  };

  const filteredAppointments = filterAppointments();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-accent-100 font-sans tracking-tight"
           style={{
             backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(0, 194, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(224, 242, 254, 0.3) 0%, transparent 50%)',
             backgroundSize: '100% 100%'
           }}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-primary-500"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-accent-100 font-sans tracking-tight"
         style={{
           backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(0, 194, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(224, 242, 254, 0.3) 0%, transparent 50%)',
           backgroundSize: '100% 100%'
         }}>
      {/* Liquid Glass Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Water Bubble */}
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 opacity-20 animate-liquid blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 188, 212, 0.3) 0%, rgba(14, 165, 233, 0.2) 50%, transparent 100%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Medium Ripple Effect */}
        <motion.div
          className="absolute bottom-20 left-20 w-48 h-48 opacity-15 animate-wave"
          style={{
            background: 'conic-gradient(from 0deg, rgba(0, 188, 212, 0.2), rgba(14, 165, 233, 0.3), rgba(0, 188, 212, 0.2))',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
          }}
          animate={{
            x: [0, 120, 0],
            y: [0, -60, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Small Glass Orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-full opacity-25 animate-float"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(0, 188, 212, 0.4))',
              backdropFilter: 'blur(10px)',
              top: `${30 + (i * 20)}%`,
              left: `${15 + (i * 10)}%`,
              animationDelay: `${i * 0.8}s`
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <Navigation />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.h1
            className="text-3xl font-bold text-primary-800 mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            My Appointments
          </motion.h1>
          <motion.p
            className="text-primary-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Manage your scheduled appointments
          </motion.p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-3xl mb-6 bg-white/70 backdrop-blur-md"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" strokeWidth={1.5} />
              {error}
            </div>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl p-1 w-fit">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-3xl text-sm font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-primary-700 hover:bg-primary-50 hover:text-primary-800'
              }`}
            >
              All ({appointments.length})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-3 rounded-3xl text-sm font-medium transition-all duration-300 ${
                filter === 'upcoming'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-primary-700 hover:bg-primary-50 hover:text-primary-800'
              }`}
            >
              Upcoming ({getFilteredAppointments('upcoming').length})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setFilter('past')}
              className={`px-6 py-3 rounded-3xl text-sm font-medium transition-all duration-300 ${
                filter === 'past'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-primary-700 hover:bg-primary-50 hover:text-primary-800'
              }`}
            >
              Past ({getFilteredAppointments('past').length})
            </motion.button>
          </div>
        </motion.div>

        {/* Appointments Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.6 + index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <AppointmentCard
                appointment={appointment}
                onCancel={handleCancelAppointment}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 300, damping: 20 }}
            className="text-center py-16"
          >
            <motion.div
              className="bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl p-12 max-w-lg mx-auto shadow-2xl relative overflow-hidden"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Glass shine effect */}
              <div
                className="absolute inset-0 animate-glass-shine pointer-events-none"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                }}
              />

              <motion.div
                className="text-6xl mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {filter === 'upcoming' ? (
                  <Calendar className="w-16 h-16 mx-auto text-primary-400" strokeWidth={1.5} />
                ) : filter === 'past' ? (
                  <Clock className="w-16 h-16 mx-auto text-primary-400" strokeWidth={1.5} />
                ) : (
                  <Clipboard className="w-16 h-16 mx-auto text-primary-400" strokeWidth={1.5} />
                )}
              </motion.div>

              <motion.h3
                className="text-xl font-medium text-primary-800 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {filter === 'upcoming'
                  ? 'No upcoming appointments'
                  : filter === 'past'
                  ? 'No past appointments'
                  : 'No appointments found'}
              </motion.h3>

              <motion.p
                className="text-primary-700 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {filter === 'upcoming'
                  ? 'Book your first appointment to get started'
                  : filter === 'past'
                  ? 'Your appointment history will appear here'
                  : 'Book an appointment to see it here'}
              </motion.p>

              {(filter === 'all' || filter === 'upcoming') && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window.location.href = '/doctors')}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-3xl font-medium shadow-lg transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span className="flex items-center justify-center">
                    Book an Appointment
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                  </span>
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Appointments;