package com.appointment.service;

import com.appointment.dto.AppointmentDTO;
import com.appointment.dto.CreateAppointmentRequest;
import com.appointment.entity.Appointment;
import com.appointment.entity.Doctor;
import com.appointment.entity.User;
import com.appointment.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AuthService authService;

    public AppointmentDTO createAppointment(CreateAppointmentRequest request, String userEmail) {
        Long doctorId = request.getDoctorId();
        if (doctorId == null) {
            throw new RuntimeException("Doctor ID cannot be null");
        }

        User user = authService.getCurrentUser(userEmail);
        Doctor doctor = doctorService.getDoctorEntityById(doctorId);

        if (request.getAppointmentDate().isBefore(LocalDateTime.now().toLocalDate())) {
            throw new RuntimeException("Cannot book appointment in the past");
        }

        Optional<Appointment> existingAppointment = appointmentRepository.findByDoctorAndAppointmentDateAndAppointmentTime(
                doctor, request.getAppointmentDate(), request.getAppointmentTime()
        );

        if (existingAppointment.isPresent() && existingAppointment.get().getStatus() == Appointment.AppointmentStatus.BOOKED) {
            throw new RuntimeException("This time slot is already booked");
        }

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setStatus(Appointment.AppointmentStatus.BOOKED);

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return new AppointmentDTO(savedAppointment);
    }

    public List<AppointmentDTO> getUserAppointments(String userEmail) {
        User user = authService.getCurrentUser(userEmail);
        return appointmentRepository.findByUserOrderByAppointmentDateDescAppointmentTimeDesc(user)
                .stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getActiveUserAppointments(String userEmail) {
        User user = authService.getCurrentUser(userEmail);
        return appointmentRepository.findActiveAppointmentsByUser(user)
                .stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }

    public AppointmentDTO cancelAppointment(Long appointmentId, String userEmail) {
        if (appointmentId == null) {
            throw new RuntimeException("Appointment ID cannot be null");
        }
        User user = authService.getCurrentUser(userEmail);
        Appointment appointment = appointmentRepository.findByIdWithUserAndDoctor(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only cancel your own appointments");
        }

        if (appointment.getStatus() == Appointment.AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Appointment is already cancelled");
        }

        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return new AppointmentDTO(savedAppointment);
    }

    public AppointmentDTO getAppointmentById(Long appointmentId, String userEmail) {
        if (appointmentId == null) {
            throw new RuntimeException("Appointment ID cannot be null");
        }
        User user = authService.getCurrentUser(userEmail);
        Appointment appointment = appointmentRepository.findByIdWithUserAndDoctor(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only view your own appointments");
        }

        return new AppointmentDTO(appointment);
    }
}