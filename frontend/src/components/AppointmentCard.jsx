import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, User, Stethoscope, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { APPOINTMENT_STATUS } from '../utils/constants';

const AppointmentCard = ({ appointment, onCancel }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case APPOINTMENT_STATUS.BOOKED:
        return {
          color: 'bg-emerald-500',
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          icon: CheckCircle
        };
      case APPOINTMENT_STATUS.CANCELLED:
        return {
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          icon: XCircle
        };
      case APPOINTMENT_STATUS.COMPLETED:
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          icon: CheckCircle
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          icon: AlertTriangle
        };
    }
  };

  const canCancel = appointment.status === APPOINTMENT_STATUS.BOOKED;
  const appointmentDate = new Date(appointment.appointmentDate);
  const isPast = appointmentDate < new Date();
  const statusInfo = getStatusInfo(appointment.status);
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
    >
      {/* Glass shine effect */}
      <div
        className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <motion.div
            className="flex items-center mb-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-2 bg-primary-100/80 rounded-2xl mr-3">
              <Stethoscope className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-800 leading-tight">
                {appointment.doctorName}
              </h3>
              <p className="text-primary-600 font-medium text-sm">{appointment.doctorSpecialty}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className={`flex items-center px-3 py-1.5 rounded-2xl ${statusInfo.bgColor} border border-white/30`}
        >
          <StatusIcon className={`w-4 h-4 mr-1.5 ${statusInfo.textColor}`} strokeWidth={1.5} />
          <span className={`text-xs font-medium ${statusInfo.textColor} uppercase tracking-wide`}>
            {appointment.status}
          </span>
        </motion.div>
      </div>

      {/* Appointment Details */}
      <motion.div
        className="space-y-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="flex items-center text-sm text-primary-700"
          whileHover={{ x: 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <div className="p-1.5 bg-primary-50 rounded-xl mr-3">
            <Calendar className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
          </div>
          <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
        </motion.div>

        <motion.div
          className="flex items-center text-sm text-primary-700"
          whileHover={{ x: 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <div className="p-1.5 bg-primary-50 rounded-xl mr-3">
            <Clock className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
          </div>
          <span className="font-medium">{formatTime(appointment.appointmentTime)}</span>
        </motion.div>

        <motion.div
          className="flex items-center text-sm text-primary-700"
          whileHover={{ x: 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <div className="p-1.5 bg-primary-50 rounded-xl mr-3">
            <MapPin className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
          </div>
          <span className="font-medium line-clamp-1">{appointment.doctorAddress}</span>
        </motion.div>

        {appointment.doctorPhone && (
          <motion.div
            className="flex items-center text-sm text-primary-700"
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="p-1.5 bg-primary-50 rounded-xl mr-3">
              <Phone className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
            </div>
            <span className="font-medium">{appointment.doctorPhone}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        {canCancel && !isPast && (
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => onCancel(appointment.id)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-600 px-4 py-2 rounded-2xl font-medium transition-all duration-300 border border-red-200/50 backdrop-blur-sm"
          >
            Cancel Appointment
          </motion.button>
        )}

        {isPast && appointment.status === APPOINTMENT_STATUS.BOOKED && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center text-sm text-primary-600 bg-primary-50/80 px-3 py-1.5 rounded-2xl"
          >
            <Clock className="w-4 h-4 mr-1.5" strokeWidth={1.5} />
            <span className="font-medium">Past appointment</span>
          </motion.div>
        )}

        {!canCancel && !isPast && (
          <div className="flex-1" />
        )}

        {/* Appointment ID for reference */}
        <motion.div
          className="text-xs text-primary-500 bg-primary-50/50 px-2 py-1 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          #{appointment.id}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AppointmentCard;