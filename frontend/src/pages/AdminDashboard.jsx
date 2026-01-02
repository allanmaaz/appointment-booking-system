import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Navigation';
import { X, User, Mail, Calendar, Phone, MapPin, Users, Stethoscope, Clock, BarChart3, Loader2, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState('all');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        window.location.href = '/login';
        return;
      }

      // Fetch admin stats and data
      const [statsRes, usersRes, doctorsRes, appointmentsRes] = await Promise.all([
        fetch('http://localhost:8080/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/doctors', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/appointments/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Check for authentication errors
      if (statsRes.status === 401 || usersRes.status === 401 || doctorsRes.status === 401 || appointmentsRes.status === 401) {
        console.error('Authentication failed - token may be expired');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      // Process responses with detailed error logging
      const adminStats = statsRes.ok ? await statsRes.json() : {};
      const usersData = usersRes.ok ? await usersRes.json() : [];
      const doctorsData = doctorsRes.ok ? await doctorsRes.json() : [];

      let appointmentsData = [];
      if (appointmentsRes.ok) {
        appointmentsData = await appointmentsRes.json();
      } else {
        console.error('Appointments API failed:', {
          status: appointmentsRes.status,
          statusText: appointmentsRes.statusText
        });
        // Try to get error details
        try {
          const errorText = await appointmentsRes.text();
          console.error('Appointments API error details:', errorText);
        } catch (e) {
          console.error('Could not read appointments error response');
        }
      }

      console.log('API Response Status:', {
        stats: statsRes.status,
        users: usersRes.status,
        doctors: doctorsRes.status,
        appointments: appointmentsRes.status
      });
      console.log('Appointments data received:', appointmentsData, 'Length:', appointmentsData.length);

      // Update stats with real data
      if (adminStats) {
        setStats(adminStats);
      }

      // Use real users data
      const realUsers = usersData.length > 0 ? usersData : [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          createdAt: '2026-01-01',
          role: 'ADMIN',
          phone: '+1-555-0123',
          address: '123 Main St, New York, NY 10001',
          lastLogin: '2026-01-01 10:30:00'
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@email.com',
          createdAt: '2026-01-01',
          role: 'USER',
          phone: '+1-555-0124',
          address: '456 Oak Ave, Los Angeles, CA 90210',
          lastLogin: '2026-01-01 09:15:00'
        }
      ];

      // Transform appointments data to match frontend expectations with safe access
      let transformedAppointments = [];
      if (appointmentsData && Array.isArray(appointmentsData) && appointmentsData.length > 0) {
        transformedAppointments = appointmentsData.map(apt => ({
          id: apt.id,
          // Handle both old entity format and new DTO format
          patientName: apt.patientName || // DTO format with helper method
                      (apt.patientFirstName && apt.patientLastName ? `${apt.patientFirstName} ${apt.patientLastName}`.trim() :
                       apt.patientFirstName || apt.patientLastName ||
                       (apt.user ? `${apt.user.firstName || ''} ${apt.user.lastName || ''}`.trim() : 'Unknown Patient')),
          doctorName: apt.doctorName || (apt.doctor ? apt.doctor.name : 'Unknown Doctor'),
          date: apt.appointmentDate || 'Unknown Date',
          status: apt.status || 'UNKNOWN',
          // Keep original data for future needs
          user: apt.user,
          doctor: apt.doctor,
          appointmentTime: apt.appointmentTime,
          appointmentDate: apt.appointmentDate,
          // Add DTO fields
          patientEmail: apt.patientEmail,
          doctorSpecialty: apt.doctorSpecialty
        }));
        console.log('Transformed appointments:', transformedAppointments);
      }

      console.log('Final appointments to set:', transformedAppointments);

      setUsers(realUsers);
      setDoctors(doctorsData);
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);

      // Check if it's a network error or server error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network error - server may be down');
        alert('Unable to connect to server. Please check your connection and try again.');
      } else if (error.message.includes('JWT') || error.message.includes('token')) {
        console.error('Authentication error - redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try refreshing the page.');
      }

      // Set minimal fallback data on error
      setUsers([]);
      setDoctors([]);
      setAppointments([]);
      setStats({
        totalUsers: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        pendingAppointments: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
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
                Loading Dashboard
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-primary-600 text-sm"
              >
                Please wait while we fetch admin data
              </motion.p>
            </div>
          </motion.div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-primary-800 mb-2 bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent flex items-center"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            Admin Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-600 text-sm sm:text-base ml-14"
          >
            Monitor and manage your appointment booking system
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('users')}
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' }} />
            <div className="flex items-center relative z-10">
              <div className="p-3 bg-blue-100/80 rounded-2xl shadow-lg">
                <Users className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-primary-800">{stats.totalUsers}</h3>
                <p className="text-primary-600 font-medium">Total Users</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('doctors')}
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' }} />
            <div className="flex items-center relative z-10">
              <div className="p-3 bg-emerald-100/80 rounded-2xl shadow-lg">
                <Stethoscope className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-primary-800">{stats.totalDoctors}</h3>
                <p className="text-primary-600 font-medium">Total Doctors</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveTab('appointments');
              setAppointmentFilter('all');
            }}
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' }} />
            <div className="flex items-center relative z-10">
              <div className="p-3 bg-purple-100/80 rounded-2xl shadow-lg">
                <Calendar className="w-6 h-6 text-purple-600" strokeWidth={1.5} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-primary-800">{stats.totalAppointments}</h3>
                <p className="text-primary-600 font-medium">Total Appointments</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveTab('appointments');
              setAppointmentFilter('pending');
            }}
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' }} />
            <div className="flex items-center relative z-10">
              <div className="p-3 bg-orange-100/80 rounded-2xl shadow-lg">
                <Clock className="w-6 h-6 text-orange-600" strokeWidth={1.5} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-primary-800">{stats.pendingAppointments}</h3>
                <p className="text-primary-600 font-medium">Pending Appointments</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/60 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-lg">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'text-primary-700 hover:text-primary-800 hover:bg-white/50'
              }`}
            >
              Overview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('users')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'text-primary-700 hover:text-primary-800 hover:bg-white/50'
              }`}
            >
              Users
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('doctors')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'doctors'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'text-primary-700 hover:text-primary-800 hover:bg-white/50'
              }`}
            >
              Doctors
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'appointments'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'text-primary-700 hover:text-primary-800 hover:bg-white/50'
              }`}
            >
              Appointments
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' }} />
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-primary-800 mb-6 flex items-center">
                  <div className="p-2 bg-primary-100/80 rounded-xl mr-3 shadow-lg">
                    <Users className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
                  </div>
                  Recent Users
                </h3>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <motion.div
                      key={user.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div>
                        <p className="text-primary-800 font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-primary-600 text-sm">{user.email}</p>
                      </div>
                      <p className="text-primary-500 text-sm font-medium">{user.createdAt}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' }} />
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-primary-800 mb-6 flex items-center">
                  <div className="p-2 bg-primary-100/80 rounded-xl mr-3 shadow-lg">
                    <Calendar className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
                  </div>
                  Recent Appointments
                </h3>
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div>
                        <p className="text-primary-800 font-semibold">{appointment.patientName}</p>
                        <p className="text-primary-600 text-sm">{appointment.doctorName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary-500 text-sm font-medium mb-1">{appointment.date}</p>
                        <span className={`px-3 py-1 rounded-2xl text-xs font-medium shadow-sm ${
                          appointment.status === 'BOOKED' ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50' :
                          appointment.status === 'COMPLETED' ? 'bg-blue-100/80 text-blue-700 border border-blue-200/50' :
                          'bg-red-100/80 text-red-700 border border-red-200/50'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' }} />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-primary-800 mb-6 flex items-center">
                <div className="p-2 bg-primary-100/80 rounded-xl mr-3 shadow-lg">
                  <Users className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
                </div>
                User Management
              </h3>
              <div className="overflow-x-auto rounded-2xl">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-100/50 backdrop-blur-sm border-b border-primary-200/30">
                      <th className="text-left py-4 px-6 text-primary-800 font-semibold">Name</th>
                      <th className="text-left py-4 px-6 text-primary-800 font-semibold">Email</th>
                      <th className="text-left py-4 px-6 text-primary-800 font-semibold">Registration Date</th>
                      <th className="text-left py-4 px-6 text-primary-800 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                        className="border-b border-white/30 hover:bg-white/50 transition-all duration-300"
                      >
                        <td className="py-4 px-6 text-primary-800 font-medium">{user.firstName} {user.lastName}</td>
                        <td className="py-4 px-6 text-primary-600">{user.email}</td>
                        <td className="py-4 px-6 text-primary-600">{user.createdAt}</td>
                        <td className="py-4 px-6">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewUserDetails(user)}
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium px-3 py-2 rounded-xl bg-primary-100/50 hover:bg-primary-200/50 border border-primary-200/30 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            View Details
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'doctors' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' }} />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-primary-800 mb-6 flex items-center">
                <div className="p-2 bg-emerald-100/80 rounded-xl mr-3">
                  <Stethoscope className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                </div>
                Doctors ({doctors.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {doctor.name ? doctor.name.charAt(0) : 'D'}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-semibold text-primary-800">{doctor.name}</h4>
                        <p className="text-sm text-primary-600">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-primary-700">
                        <span className="font-medium">Experience:</span>
                        <span className="ml-2">{doctor.experience || 'N/A'}</span>
                      </div>
                      {doctor.phone && (
                        <div className="flex items-center text-primary-700">
                          <Phone className="w-4 h-4 mr-2" strokeWidth={1.5} />
                          <span>{doctor.phone}</span>
                        </div>
                      )}
                      {doctor.address && (
                        <div className="flex items-center text-primary-700">
                          <MapPin className="w-4 h-4 mr-2" strokeWidth={1.5} />
                          <span className="truncate">{doctor.address}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              {doctors.length === 0 && (
                <div className="text-center py-8 text-primary-600">
                  <Stethoscope className="w-12 h-12 mx-auto mb-4 text-primary-400" strokeWidth={1.5} />
                  <p>No doctors found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'appointments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-primary-800 flex items-center">
                  <div className="p-2 bg-primary-100/80 rounded-xl mr-3 shadow-lg">
                    <Calendar className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
                  </div>
                  Appointment Management
                </h3>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAppointmentFilter('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm border ${
                      appointmentFilter === 'all'
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-primary-600 shadow-md'
                        : 'bg-white/50 text-primary-700 border-white/30 hover:bg-white/70'
                    }`}
                  >
                    All ({appointments.length})
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAppointmentFilter('pending')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm border ${
                      appointmentFilter === 'pending'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-600 shadow-md'
                        : 'bg-white/50 text-orange-700 border-white/30 hover:bg-white/70'
                    }`}
                  >
                    Pending ({appointments.filter(apt => apt.status === 'BOOKED').length})
                  </motion.button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-2xl">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-100/50 backdrop-blur-sm border-b border-primary-200/30">
                      <th className="text-left py-4 px-6 text-primary-800 font-semibold">Patient</th>
                      <th className="text-left py-4 px-6 text-primary-800 font-semibold">Doctor</th>
                      <th className="text-left py-4 px-6 text-primary-800 font-semibold">Date</th>
                      <th className="text-left py-4 px-6 text-primary-800 font-semibold">Status</th>
                      <th className="text-left py-4 px-6 text-primary-800 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.filter(appointment =>
                      appointmentFilter === 'all' ||
                      (appointmentFilter === 'pending' && appointment.status === 'BOOKED')
                    ).map((appointment, index) => (
                      <motion.tr
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                        className="border-b border-white/30 hover:bg-white/50 transition-all duration-300"
                      >
                        <td className="py-4 px-6 text-primary-800 font-medium">{appointment.patientName}</td>
                        <td className="py-4 px-6 text-primary-600">{appointment.doctorName}</td>
                        <td className="py-4 px-6 text-primary-600">{appointment.date}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-2 rounded-2xl text-xs font-medium shadow-sm border ${
                            appointment.status === 'BOOKED' ? 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50' :
                            appointment.status === 'COMPLETED' ? 'bg-blue-100/80 text-blue-700 border-blue-200/50' :
                            'bg-red-100/80 text-red-700 border-red-200/50'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-primary-600 hover:text-primary-800 text-sm font-medium px-3 py-2 rounded-xl bg-primary-100/50 hover:bg-primary-200/50 border border-primary-200/30 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-2 rounded-xl bg-red-100/50 hover:bg-red-200/50 border border-red-200/30 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white/90 backdrop-blur-md border border-white/30 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glass shine effect */}
              <div
                className="absolute inset-0 animate-glass-shine pointer-events-none opacity-30"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-primary-800 flex items-center">
                    <div className="p-2 bg-primary-100/80 rounded-xl mr-3">
                      <User className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
                    </div>
                    User Details
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseModal}
                    className="text-primary-600 hover:text-primary-800 p-2 rounded-xl bg-primary-100/50 hover:bg-primary-200/50 transition-all duration-300"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </motion.button>
                </div>

                <div className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30"
                  >
                    <div className="p-2 bg-primary-100/80 rounded-xl">
                      <User className="text-primary-600" size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-primary-600 text-sm font-medium">Full Name</p>
                      <p className="text-primary-800 font-semibold">{selectedUser.firstName} {selectedUser.lastName}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center space-x-4 p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30"
                  >
                    <div className="p-2 bg-primary-100/80 rounded-xl">
                      <Mail className="text-primary-600" size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-primary-600 text-sm font-medium">Email</p>
                      <p className="text-primary-800 font-semibold">{selectedUser.email}</p>
                    </div>
                  </motion.div>

                  {selectedUser.phone && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center space-x-4 p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30"
                    >
                      <div className="p-2 bg-primary-100/80 rounded-xl">
                        <Phone className="text-primary-600" size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-primary-600 text-sm font-medium">Phone</p>
                        <p className="text-primary-800 font-semibold">{selectedUser.phone}</p>
                      </div>
                    </motion.div>
                  )}

                  {selectedUser.address && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center space-x-4 p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30"
                    >
                      <div className="p-2 bg-primary-100/80 rounded-xl">
                        <MapPin className="text-primary-600" size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-primary-600 text-sm font-medium">Address</p>
                        <p className="text-primary-800 font-semibold">{selectedUser.address}</p>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center space-x-4 p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30"
                  >
                    <div className="p-2 bg-primary-100/80 rounded-xl">
                      <Calendar className="text-primary-600" size={18} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <p className="text-primary-600 text-sm font-medium">Registration Date</p>
                      <p className="text-primary-800 font-semibold">{selectedUser.createdAt}</p>
                    </div>
                    <span className={`px-3 py-2 rounded-2xl text-xs font-medium shadow-sm border ${
                      selectedUser.role === 'ADMIN' ? 'bg-red-100/80 text-red-700 border-red-200/50' :
                      selectedUser.role === 'DOCTOR' ? 'bg-blue-100/80 text-blue-700 border-blue-200/50' :
                      'bg-emerald-100/80 text-emerald-700 border-emerald-200/50'
                    }`}>
                      {selectedUser.role}
                    </span>
                  </motion.div>

                  {selectedUser.lastLogin && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center space-x-4 p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30"
                    >
                      <div className="p-2 bg-primary-100/80 rounded-xl">
                        <Clock className="text-primary-600" size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-primary-600 text-sm font-medium">Last Login</p>
                        <p className="text-primary-800 font-semibold">{selectedUser.lastLogin}</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseModal}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-2xl font-medium shadow-lg transition-all duration-300"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;