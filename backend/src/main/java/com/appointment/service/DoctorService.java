package com.appointment.service;

import com.appointment.dto.DoctorDTO;
import com.appointment.entity.Doctor;
import com.appointment.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(DoctorDTO::new)
                .collect(Collectors.toList());
    }

    public DoctorDTO getDoctorById(@NonNull Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
        return new DoctorDTO(doctor);
    }

    public List<DoctorDTO> searchDoctorsBySpecialty(String specialty) {
        return doctorRepository.findDoctorsBySpecialty(specialty)
                .stream()
                .map(DoctorDTO::new)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> getNearbyDoctors(BigDecimal latitude, BigDecimal longitude, int limit) {
        List<Doctor> doctors = doctorRepository.findNearbyDoctors(latitude, longitude, limit);
        return doctors.stream()
                .map(doctor -> {
                    DoctorDTO dto = new DoctorDTO(doctor);
                    // Calculate distance using Haversine formula
                    double distance = calculateDistance(
                        latitude.doubleValue(),
                        longitude.doubleValue(),
                        doctor.getLatitude().doubleValue(),
                        doctor.getLongitude().doubleValue()
                    );
                    dto.setDistance(distance);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371; // Radius of the Earth in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c; // Distance in kilometers
    }

    public Doctor getDoctorEntityById(@NonNull Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }
}