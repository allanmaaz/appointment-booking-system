import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor, userLocation }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/doctors/${doctor.id}`);
  };

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${doctor.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl p-6 shadow-2xl relative overflow-hidden group cursor-pointer"
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
              <User className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-800 leading-tight">
                {doctor.name}
              </h3>
              <p className="text-primary-600 font-medium text-sm">{doctor.specialty}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center px-3 py-1.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/30"
        >
          <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
          <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
            Available
          </span>
        </motion.div>
      </div>

      {/* Doctor Details */}
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
            <MapPin className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
          </div>
          <span className="font-medium line-clamp-2">{doctor.address}</span>
        </motion.div>

        {doctor.phone && (
          <motion.div
            className="flex items-center text-sm text-primary-700"
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="p-1.5 bg-primary-50 rounded-xl mr-3">
              <Phone className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
            </div>
            <span className="font-medium">{doctor.phone}</span>
          </motion.div>
        )}

        {/* Distance indicator when user location is available */}
        {doctor.distance && (
          <motion.div
            className="flex items-center text-sm text-primary-700"
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="p-1.5 bg-emerald-50 rounded-xl mr-3">
              <MapPin className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            </div>
            <span className="font-medium text-emerald-700">
              {doctor.distance < 1
                ? `${Math.round(doctor.distance * 1000)}m away`
                : `${doctor.distance.toFixed(1)}km away`
              }
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Actions */}
      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={handleViewProfile}
          className="flex-1 bg-white/50 hover:bg-white/70 text-primary-700 border border-primary-200/50 px-4 py-3 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
        >
          <User className="w-4 h-4 mr-2" strokeWidth={1.5} />
          View Profile
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={handleBookAppointment}
          className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-3 rounded-2xl font-medium shadow-lg transition-all duration-300 group flex items-center justify-center"
        >
          <Calendar className="w-4 h-4 mr-2" strokeWidth={1.5} />
          <span>Book Now</span>
          <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DoctorCard;