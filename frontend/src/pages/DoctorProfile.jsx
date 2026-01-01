import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorAPI } from '../api/api';
import Navigation from '../components/Navigation';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getDoctorById(id);
      setDoctor(response.data);
    } catch (err) {
      setError('Failed to fetch doctor details');
      console.error('Error fetching doctor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${doctor.id}`);
  };

  const handleViewOnMap = () => {
    navigate(`/map?doctorId=${doctor.id}&lat=${doctor.latitude}&lng=${doctor.longitude}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-dark-950">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">Doctor not found</h3>
            <p className="text-gray-400 mb-4">{error || 'The requested doctor could not be found'}</p>
            <button
              onClick={() => navigate('/doctors')}
              className="btn-primary"
            >
              Back to Doctors
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/doctors')}
            className="text-primary-400 hover:text-primary-300 mb-4 flex items-center"
          >
            ← Back to Doctors
          </button>
        </div>

        {/* Doctor Profile */}
        <div className="card">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{doctor.name}</h1>
              <div className="flex items-center mb-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {doctor.specialty}
                </span>
                <span className="ml-3 text-sm text-gray-400 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Available
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="mr-3 mt-1">📍</span>
                  <div>
                    <p className="text-gray-300">{doctor.address}</p>
                  </div>
                </div>
                {doctor.phone && (
                  <div className="flex items-center">
                    <span className="mr-3">📞</span>
                    <p className="text-gray-300">{doctor.phone}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="mr-3">🩺</span>
                  <p className="text-gray-300">Specializes in {doctor.specialty}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
              <div className="bg-dark-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300">Coordinates</span>
                  <span className="text-sm text-gray-400">
                    {parseFloat(doctor.latitude).toFixed(4)}, {parseFloat(doctor.longitude).toFixed(4)}
                  </span>
                </div>
                <button
                  onClick={handleViewOnMap}
                  className="w-full btn-secondary"
                >
                  View on Map
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-dark-700">
            <div className="flex space-x-4">
              <button
                onClick={handleBookAppointment}
                className="btn-primary flex-1"
              >
                Book Appointment
              </button>
              <button
                onClick={handleViewOnMap}
                className="btn-secondary"
              >
                🗺️ View on Map
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="card mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">About</h2>
          <div className="space-y-4">
            <div className="bg-dark-800 rounded-lg p-4">
              <h3 className="font-medium text-white mb-2">Specialty</h3>
              <p className="text-gray-300">{doctor.specialty}</p>
            </div>
            <div className="bg-dark-800 rounded-lg p-4">
              <h3 className="font-medium text-white mb-2">Availability</h3>
              <p className="text-gray-300">Available for appointments. Please select your preferred time slot when booking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;