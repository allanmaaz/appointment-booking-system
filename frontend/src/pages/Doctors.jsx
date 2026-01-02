import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, AlertCircle, Users, MapPin, Navigation as NavigationIcon, Loader2, X } from 'lucide-react';
import { doctorAPI } from '../api/api';
import DoctorCard from '../components/DoctorCard';
import Navigation from '../components/Navigation';
import { SPECIALTIES } from '../utils/constants';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [sortByDistance, setSortByDistance] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, selectedSpecialty]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getAllDoctors();
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (err) {
      setError('Failed to fetch doctors');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(doctor =>
        doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    // Add distance calculation if user location is available
    if (userLocation) {
      filtered = filtered.map(doctor => ({
        ...doctor,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          parseFloat(doctor.latitude),
          parseFloat(doctor.longitude)
        )
      }));

      // Sort by distance if enabled
      if (sortByDistance) {
        filtered.sort((a, b) => a.distance - b.distance);
      }
    }

    setFilteredDoctors(filtered);
  };

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty === selectedSpecialty ? '' : specialty);
  };

  const requestLocation = () => {
    setShowLocationPrompt(true);
  };

  const handleLocationAccept = () => {
    setLocationLoading(true);
    setLocationError('');
    setShowLocationPrompt(false);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location = { latitude, longitude };
        setUserLocation(location);
        localStorage.setItem('userLocation', JSON.stringify(location));

        try {
          // Fetch nearby doctors
          const response = await doctorAPI.getNearbyDoctors(latitude, longitude, 50);
          if (response.data.length > 0) {
            setDoctors(response.data);
            setSortByDistance(true);
          }
        } catch (err) {
          console.error('Error fetching nearby doctors:', err);
          // Keep existing doctors if nearby search fails
        }

        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Could not get your location. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access was denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleLocationDecline = () => {
    setShowLocationPrompt(false);
  };

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setUserLocation(JSON.parse(savedLocation));
        setSortByDistance(true);
      } catch (err) {
        localStorage.removeItem('userLocation');
      }
    }
  }, []);

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
    <motion.div
      className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-accent-100 font-sans tracking-tight"
      style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(0, 194, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(224, 242, 254, 0.3) 0%, transparent 50%)',
        backgroundSize: '100% 100%'
      }}
    >
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
            Find Doctors
          </motion.h1>
          <motion.p
            className="text-primary-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Book an appointment with qualified healthcare professionals
          </motion.p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 backdrop-blur-md border border-red-500/20 text-red-600 px-4 py-3 rounded-3xl mb-6"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" strokeWidth={1.5} />
              {error}
            </div>
          </motion.div>
        )}

        {/* Location-Based Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Glass shine effect */}
            <div
              className="absolute inset-0 animate-glass-shine pointer-events-none opacity-30"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
              }}
            />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {userLocation ? 'Showing doctors near you' : 'Find Doctors Near You'}
                  </h2>
                  <p className="text-primary-100 text-sm">
                    {userLocation
                      ? 'Results sorted by distance from your location'
                      : 'Get personalized results based on your location'
                    }
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={userLocation ? () => setUserLocation(null) : requestLocation}
                  disabled={locationLoading}
                  className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center min-w-[140px] justify-center"
                >
                  {locationLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" strokeWidth={1.5} />
                      Finding...
                    </>
                  ) : userLocation ? (
                    <>
                      <X className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      Clear Location
                    </>
                  ) : (
                    <>
                      <NavigationIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      Use My Location
                    </>
                  )}
                </motion.button>
              </div>

              {locationError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-500/20 border border-red-300/30 rounded-2xl text-red-100 text-sm"
                >
                  {locationError}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <div className="space-y-6">
            {/* Search Bar */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="bg-white/70 backdrop-blur-md border-white/20 border rounded-3xl p-1 shadow-2xl relative overflow-hidden">
                {/* Glass shine effect */}
                <div
                  className="absolute inset-0 animate-glass-shine pointer-events-none opacity-30"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                  }}
                />

                <div className="relative flex items-center">
                  <div className="p-3 text-primary-600">
                    <Search className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search doctors by name, specialty, or location..."
                    className="flex-1 bg-transparent text-primary-800 placeholder-primary-500 px-2 py-3 focus:outline-none font-medium text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>

          {/* Specialty Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-1.5 bg-primary-100/80 rounded-xl mr-3">
                <Filter className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-medium text-primary-700">Filter by Specialty</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((specialty, index) => (
                <motion.button
                  key={specialty}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSpecialtyChange(specialty)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 backdrop-blur-md ${
                    selectedSpecialty === specialty
                      ? 'bg-primary-500 text-white shadow-lg border border-primary-400/30'
                      : 'bg-white/50 border border-white/30 text-primary-700 hover:bg-white/70 hover:text-primary-800'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                    opacity: { delay: 0.7 + index * 0.05, duration: 0.4 },
                    y: { delay: 0.7 + index * 0.05, duration: 0.4 }
                  }}
                >
                  {specialty}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Results Count and Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center text-primary-700 bg-white/50 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2">
              <Users className="w-4 h-4 mr-2 text-primary-600" strokeWidth={1.5} />
              <p className="font-medium text-sm sm:text-base">
                {filteredDoctors.length === 0 ? 'No doctors found' :
                 filteredDoctors.length === 1 ? '1 doctor found' :
                 `${filteredDoctors.length} doctors found`}
              </p>
            </div>

            {userLocation && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setSortByDistance(!sortByDistance)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 backdrop-blur-md flex items-center ${
                  sortByDistance
                    ? 'bg-primary-500 text-white border border-primary-400/30'
                    : 'bg-white/50 border border-white/30 text-primary-700 hover:bg-white/70'
                }`}
              >
                <MapPin className="w-4 h-4 mr-2" strokeWidth={1.5} />
                {sortByDistance ? 'Sorted by Distance' : 'Sort by Distance'}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Doctors Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 1.0 + index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <DoctorCard doctor={doctor} userLocation={userLocation} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && !loading && (
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
                <Search className="w-16 h-16 mx-auto text-primary-400" strokeWidth={1.5} />
              </motion.div>

              <motion.h3
                className="text-xl font-medium text-primary-800 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                No doctors found
              </motion.h3>

              <motion.p
                className="text-primary-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Try adjusting your search criteria
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {/* Location Permission Modal */}
        <AnimatePresence>
          {showLocationPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-primary-900/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={handleLocationDecline}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/90 backdrop-blur-md border border-white/30 rounded-3xl p-6 max-w-md mx-auto shadow-2xl relative overflow-hidden"
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
                  <div className="text-center mb-6">
                    <div className="p-3 bg-primary-100/80 rounded-2xl w-fit mx-auto mb-4">
                      <NavigationIcon className="w-8 h-8 text-primary-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-primary-800 mb-2">
                      Find Doctors Near You
                    </h3>
                    <p className="text-primary-700 text-sm leading-relaxed">
                      We'd like to access your location to show you nearby doctors and provide personalized recommendations. Your location will only be used for this search.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onClick={handleLocationDecline}
                      className="flex-1 bg-white/50 hover:bg-white/70 text-primary-700 border border-primary-200/50 px-4 py-3 rounded-2xl font-medium transition-all duration-300"
                    >
                      Not Now
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onClick={handleLocationAccept}
                      className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-3 rounded-2xl font-medium shadow-lg transition-all duration-300"
                    >
                      Allow Access
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.div>
  );
};

export default Doctors;