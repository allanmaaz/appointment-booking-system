import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { doctorAPI } from '../api/api';
import Navigation from '../components/Navigation';
import { APP_CONSTANTS } from '../utils/constants';
import { MapPin, Navigation as NavigationIcon, User, Phone, Calendar, Loader2, AlertCircle } from 'lucide-react';

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom doctor marker icon
const createDoctorIcon = (specialty) => {
  const color = getSpecialtyColor(specialty);
  return L.divIcon({
    className: 'custom-doctor-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        font-size: 16px;
      ">
        🏥
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const getSpecialtyColor = (specialty) => {
  const colors = {
    'Cardiology': '#ef4444',
    'Dermatology': '#f59e0b',
    'Emergency Medicine': '#dc2626',
    'Family Medicine': '#10b981',
    'Gynecology': '#ec4899',
    'Neurology': '#8b5cf6',
    'Oncology': '#6366f1',
    'Ophthalmology': '#06b6d4',
    'Orthopedics': '#84cc16',
    'Pediatrics': '#f97316',
    'Psychiatry': '#a855f7',
    'Radiology': '#64748b',
  };
  return colors[specialty] || '#3b82f6';
};

// Component to update map view
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const MapView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState([APP_CONSTANTS.DEFAULT_LAT, APP_CONSTANTS.DEFAULT_LNG]);
  const [mapZoom, setMapZoom] = useState(APP_CONSTANTS.DEFAULT_ZOOM);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    // Check for URL parameters to focus on specific doctor
    const doctorId = searchParams.get('doctorId');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (lat && lng) {
      setMapCenter([parseFloat(lat), parseFloat(lng)]);
      setMapZoom(15);
    }

    fetchDoctors();
  }, [searchParams]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getAllDoctors();
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to fetch doctors');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (doctor) => {
    setSelectedDoctor(doctor);
    setMapCenter([parseFloat(doctor.latitude), parseFloat(doctor.longitude)]);
  };

  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  const handleViewProfile = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setMapZoom(15);
        setGettingLocation(false);

        // Fetch nearby doctors
        fetchNearbyDoctors(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        setGettingLocation(false);
        alert('Could not get your location. Please enable location services.');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const fetchNearbyDoctors = async (lat, lng) => {
    try {
      const response = await doctorAPI.getNearbyDoctors(lat, lng, 20);
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching nearby doctors:', err);
      // Fallback to all doctors if nearby search fails
      fetchDoctors();
    }
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
                Loading Doctor Map
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-primary-600 text-sm"
              >
                Please wait while we load doctor locations
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-primary-800 mb-2 bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
                Doctor Locations
              </h1>
              <p className="text-primary-600 text-sm sm:text-base">Find doctors near you on the interactive map</p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="flex items-center bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-primary-300 disabled:to-primary-400 text-white px-4 sm:px-6 py-3 rounded-2xl font-medium shadow-lg transition-all duration-300 self-start disabled:cursor-not-allowed"
            >
              {gettingLocation ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Loader2 className="w-4 h-4" />
                  </motion.div>
                  Getting Location...
                </>
              ) : (
                <>
                  <NavigationIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Find Nearby
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Doctor List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl max-h-96 overflow-y-auto relative group">
              {/* Glass shine effect */}
              <div
                className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                }}
              />

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg font-semibold text-primary-800 mb-4 flex items-center relative z-10"
              >
                <div className="w-6 h-6 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                  <User className="w-3 h-3 text-primary-600" />
                </div>
                Doctors ({doctors.length})
              </motion.h2>

              <div className="space-y-3 relative z-10">
                {doctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ x: 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-primary-300 bg-primary-50/80 shadow-md'
                        : 'border-white/30 bg-white/40 hover:bg-white/60 hover:border-primary-200'
                    }`}
                    onClick={() => handleMarkerClick(doctor)}
                  >
                    <h3 className="font-medium text-primary-800 text-sm leading-tight">{doctor.name}</h3>
                    <p className="text-xs text-primary-600 font-medium mt-1">{doctor.specialty}</p>
                    <p className="text-xs text-primary-500 mt-1 line-clamp-2">{doctor.address}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-2xl relative group" style={{ height: '600px' }}>
              {/* Glass shine effect */}
              <div
                className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 rounded-3xl"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                }}
              />
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <ChangeView center={mapCenter} zoom={mapZoom} />
                <TileLayer
                  attribution={APP_CONSTANTS.MAP_ATTRIBUTION}
                  url={APP_CONSTANTS.MAP_TILE_URL}
                />
                {doctors.map((doctor) => (
                  <Marker
                    key={doctor.id}
                    position={[parseFloat(doctor.latitude), parseFloat(doctor.longitude)]}
                    icon={createDoctorIcon(doctor.specialty)}
                    eventHandlers={{
                      click: () => handleMarkerClick(doctor),
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-64">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {doctor.name}
                        </h3>
                        <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>

                        <div className="space-y-1 mb-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="mr-1">📍</span>
                            <span>{doctor.address}</span>
                          </div>
                          {doctor.phone && (
                            <div className="flex items-center">
                              <span className="mr-1">📞</span>
                              <span>{doctor.phone}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewProfile(doctor.id)}
                            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => handleBookAppointment(doctor.id)}
                            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* User Location Marker */}
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon={L.divIcon({
                      className: 'user-location-marker',
                      html: `
                        <div style="
                          background-color: #3b82f6;
                          width: 20px;
                          height: 20px;
                          border-radius: 50%;
                          border: 3px solid white;
                          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                          position: relative;
                        ">
                          <div style="
                            background-color: #1d4ed8;
                            width: 10px;
                            height: 10px;
                            border-radius: 50%;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                          "></div>
                        </div>
                      `,
                      iconSize: [20, 20],
                      iconAnchor: [10, 10],
                    })}
                  >
                    <Popup>
                      <div className="text-center p-2">
                        <p className="font-medium text-blue-600">Your Location</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            {/* Map Legend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative group"
            >
              {/* Glass shine effect */}
              <div
                className="absolute inset-0 animate-glass-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                }}
              />

              <h3 className="text-sm font-semibold text-primary-800 mb-4 flex items-center relative z-10">
                <div className="w-5 h-5 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="w-3 h-3 text-primary-600" />
                </div>
                Specialty Colors
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs relative z-10">
                {['Cardiology', 'Dermatology', 'Family Medicine', 'Pediatrics', 'Orthopedics', 'Neurology', 'Psychiatry', 'Oncology'].map((specialty, index) => (
                  <motion.div
                    key={specialty}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="flex items-center bg-white/40 backdrop-blur-sm p-2 rounded-xl border border-white/20 hover:bg-white/60 transition-all duration-300"
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2 shadow-sm"
                      style={{ backgroundColor: getSpecialtyColor(specialty) }}
                    ></div>
                    <span className="text-primary-700 font-medium">{specialty}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MapView;