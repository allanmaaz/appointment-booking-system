import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, MapPin, Phone, Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { doctorAPI, appointmentAPI } from '../api/api';
import Navigation from '../components/Navigation';
import { TIME_SLOTS } from '../utils/constants';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [appointmentData, setAppointmentData] = useState({
    appointmentDate: '',
    appointmentTime: '',
  });

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getDoctorById(doctorId);
      setDoctor(response.data);
    } catch (err) {
      setError('Failed to fetch doctor details');
      console.error('Error fetching doctor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validation
    if (!appointmentData.appointmentDate) {
      setError('Please select an appointment date');
      setSubmitting(false);
      return;
    }

    if (!appointmentData.appointmentTime) {
      setError('Please select an appointment time');
      setSubmitting(false);
      return;
    }

    try {
      const requestData = {
        doctorId: parseInt(doctorId),
        appointmentDate: appointmentData.appointmentDate, // Backend expects YYYY-MM-DD format
        appointmentTime: appointmentData.appointmentTime, // Backend expects HH:MM:SS format
      };

      console.log('Booking appointment with data:', requestData);

      const response = await appointmentAPI.createAppointment(requestData);
      console.log('Appointment booked successfully:', response.data);

      setSuccess('Appointment booked successfully!');

      setTimeout(() => {
        navigate('/appointments');
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to book appointment';
      setError(errorMessage);
      console.error('Error booking appointment:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
        <Navigation />

        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-wave-200/25 rounded-full blur-3xl animate-float delay-2000"></div>
        </div>

        <div className="flex items-center justify-center min-h-[70vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl text-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-primary-800 mb-2"
              >
                Loading Doctor Details
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-primary-600 text-sm"
              >
                Please wait while we fetch the information
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
        <Navigation />

        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-red-200/25 rounded-full blur-3xl animate-float delay-2000"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex items-center justify-center min-h-[70vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl text-center max-w-md mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-2xl flex items-center justify-center"
              >
                <AlertCircle className="w-8 h-8 text-red-600" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-semibold text-red-800 mb-3"
              >
                Doctor not found
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-red-600 mb-6 text-sm leading-relaxed"
              >
                {error}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/doctors')}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl font-medium shadow-lg transition-all duration-300 flex items-center mx-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Doctors
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
      <Navigation />

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-wave-200/25 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-primary-300/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-6 sm:mb-8"
        >
          <motion.button
            whileHover={{ x: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => navigate('/doctors')}
            className="text-primary-700 hover:text-primary-800 mb-4 flex items-center group bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-white/20 px-4 py-2.5 rounded-2xl transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Doctors
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-primary-800 mb-2 bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent"
          >
            Book Appointment
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-600 text-sm sm:text-base"
          >
            Schedule your appointment with Dr. {doctor?.name}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Doctor Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group"
          >
            {/* Glass shine effect */}
            <div
              className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              }}
            />

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl font-semibold text-primary-800 mb-6 flex items-center"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              Doctor Information
            </motion.h2>

            {doctor && (
              <div className="space-y-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="ml-4 sm:ml-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-primary-800 leading-tight">{doctor.name}</h3>
                    <p className="text-primary-600 font-medium text-sm sm:text-base">{doctor.specialty}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex items-center text-sm sm:text-base text-primary-700 bg-white/40 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-white/20"
                  >
                    <div className="p-2 bg-primary-100/80 rounded-xl mr-3">
                      <MapPin className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
                    </div>
                    <span className="font-medium leading-relaxed">{doctor.address}</span>
                  </motion.div>

                  {doctor.phone && (
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="flex items-center text-sm sm:text-base text-primary-700 bg-white/40 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-white/20"
                    >
                      <div className="p-2 bg-primary-100/80 rounded-xl mr-3">
                        <Phone className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
                      </div>
                      <span className="font-medium">{doctor.phone}</span>
                    </motion.div>
                  )}

                  {/* Availability indicator */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center justify-center bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-4"
                  >
                    <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                    <span className="text-emerald-700 font-medium text-sm">Available for appointments</span>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group"
          >
            {/* Glass shine effect */}
            <div
              className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              }}
            />

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl sm:text-2xl font-semibold text-primary-800 mb-6 flex items-center"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                <Calendar className="w-4 h-4 text-primary-600" />
              </div>
              Select Date & Time
            </motion.h2>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-2xl mb-6 flex items-center"
                >
                  <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 text-emerald-700 px-4 py-3 rounded-2xl mb-6 flex items-center"
                >
                  <CheckCircle className="w-5 h-5 mr-3 text-emerald-600" />
                  <span className="font-medium">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6 relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-primary-700 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                  Appointment Date
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  type="date"
                  name="appointmentDate"
                  required
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl text-primary-800 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 text-sm sm:text-base"
                  value={appointmentData.appointmentDate}
                  onChange={handleInputChange}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-medium text-primary-700 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary-600" />
                  Appointment Time
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  name="appointmentTime"
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 text-sm sm:text-base"
                  value={appointmentData.appointmentTime}
                  onChange={handleInputChange}
                >
                  <option value="" className="text-primary-600">Select a time</option>
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time} className="text-primary-800">
                      {time.substring(0, 5)} {/* Display only HH:MM for better UX */}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 text-blue-700 px-4 py-4 rounded-2xl"
              >
                <p className="text-sm leading-relaxed">
                  <strong className="text-blue-800">Note:</strong> Appointments can be booked up to 3 months in advance.
                  Please arrive 15 minutes before your scheduled time.
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-primary-300 disabled:to-primary-400 text-white px-6 py-4 rounded-2xl font-semibold shadow-xl transition-all duration-300 flex items-center justify-center text-sm sm:text-base disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-3"
                    >
                      <Loader2 className="w-4 h-4" />
                    </motion.div>
                    Booking Appointment...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;