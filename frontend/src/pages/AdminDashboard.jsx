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
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // In a real app, you'd have admin-specific endpoints
      const [usersRes, appointmentsRes, doctorsRes] = await Promise.all([
        fetch('http://localhost:8080/api/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).catch(() => ({ json: () => [] })),
        fetch('http://localhost:8080/api/appointments/all', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).catch(() => ({ json: () => [] })),
        fetch('http://localhost:8080/api/doctors', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).catch(() => ({ json: () => [] }))
      ]);

      // Mock data for demo
      const mockUsers = [
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

      const mockAppointments = [
        { id: 1, patientName: 'John Doe', doctorName: 'Dr. Michael Johnson', date: '2026-01-15', status: 'BOOKED' },
        { id: 2, patientName: 'Jane Smith', doctorName: 'Dr. Sarah Williams', date: '2026-01-16', status: 'COMPLETED' }
      ];

      setUsers(mockUsers);
      setAppointments(mockAppointments);

      setStats({
        totalUsers: mockUsers.length,
        totalDoctors: 6, // From our data.sql
        totalAppointments: mockAppointments.length,
        pendingAppointments: mockAppointments.filter(a => a.status === 'BOOKED').length
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
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
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
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
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
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
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
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
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
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
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Users</h3>
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b border-dark-600 last:border-0">
                    <div>
                      <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <p className="text-gray-400 text-sm">{user.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Appointments</h3>
              <div className="space-y-3">
                {appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between py-2 border-b border-dark-600 last:border-0">
                    <div>
                      <p className="text-white font-medium">{appointment.patientName}</p>
                      <p className="text-gray-400 text-sm">{appointment.doctorName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">{appointment.date}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'BOOKED' ? 'bg-green-900 text-green-300' :
                        appointment.status === 'COMPLETED' ? 'bg-blue-900 text-blue-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-600">
                    <th className="text-left py-3 px-4 text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 text-gray-300">Registration Date</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-dark-700/50">
                      <td className="py-3 px-4 text-white">{user.firstName} {user.lastName}</td>
                      <td className="py-3 px-4 text-gray-300">{user.email}</td>
                      <td className="py-3 px-4 text-gray-300">{user.createdAt}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewUserDetails(user)}
                          className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6">Appointment Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-600">
                    <th className="text-left py-3 px-4 text-gray-300">Patient</th>
                    <th className="text-left py-3 px-4 text-gray-300">Doctor</th>
                    <th className="text-left py-3 px-4 text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-dark-700/50">
                      <td className="py-3 px-4 text-white">{appointment.patientName}</td>
                      <td className="py-3 px-4 text-gray-300">{appointment.doctorName}</td>
                      <td className="py-3 px-4 text-gray-300">{appointment.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'BOOKED' ? 'bg-green-900 text-green-300' :
                          appointment.status === 'COMPLETED' ? 'bg-blue-900 text-blue-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-primary-400 hover:text-primary-300 text-sm mr-3">
                          Edit
                        </button>
                        <button className="text-red-400 hover:text-red-300 text-sm">
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-dark-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">User Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="text-primary-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="text-white">{selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="text-primary-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{selectedUser.email}</p>
                </div>
              </div>

              {selectedUser.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="text-primary-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">{selectedUser.phone}</p>
                  </div>
                </div>
              )}

              {selectedUser.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="text-primary-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white">{selectedUser.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar className="text-primary-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Registration Date</p>
                  <p className="text-white">{selectedUser.createdAt}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedUser.role === 'ADMIN' ? 'bg-red-900 text-red-300' :
                    selectedUser.role === 'DOCTOR' ? 'bg-blue-900 text-blue-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Role</p>
                </div>
              </div>

              {selectedUser.lastLogin && (
                <div className="flex items-center space-x-3">
                  <Calendar className="text-primary-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Last Login</p>
                    <p className="text-white">{selectedUser.lastLogin}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;