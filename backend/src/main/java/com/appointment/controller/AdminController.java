package com.appointment.controller;

import com.appointment.entity.User;
import com.appointment.entity.Appointment;
import com.appointment.repository.UserRepository;
import com.appointment.repository.AppointmentRepository;
import com.appointment.repository.DoctorRepository;
import com.appointment.dto.AdminAppointmentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/appointments/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminAppointmentDTO>> getAllAppointments() {
        System.out.println("=== Admin getAllAppointments called ===");
        List<Appointment> appointments = appointmentRepository.findAllWithUserAndDoctor();
        System.out.println("Found " + appointments.size() + " appointments");

        // Convert to DTOs to avoid JSON serialization issues
        List<AdminAppointmentDTO> appointmentDTOs = new ArrayList<>();
        for (Appointment apt : appointments) {
            System.out.println("Processing Appointment ID: " + apt.getId() + ", Patient: " +
                (apt.getUser() != null ? apt.getUser().getFirstName() + " " + apt.getUser().getLastName() : "NULL") +
                ", Doctor: " + (apt.getDoctor() != null ? apt.getDoctor().getName() : "NULL") +
                ", Status: " + apt.getStatus());

            AdminAppointmentDTO dto = new AdminAppointmentDTO(apt);
            appointmentDTOs.add(dto);
        }

        System.out.println("=== Returning " + appointmentDTOs.size() + " appointment DTOs ===");
        return ResponseEntity.ok(appointmentDTOs);
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();

        long userCount = userRepository.count();
        long doctorCount = doctorRepository.count();
        long appointmentCount = appointmentRepository.count();
        long pendingAppointments = appointmentRepository.countByStatus(Appointment.AppointmentStatus.BOOKED);

        stats.put("totalUsers", userCount);
        stats.put("totalDoctors", doctorCount);
        stats.put("totalAppointments", appointmentCount);
        stats.put("pendingAppointments", pendingAppointments);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/appointments/test")
    public ResponseEntity<String> testAppointments() {
        System.out.println("=== TEST ENDPOINT CALLED ===");
        try {
            List<Appointment> appointments = appointmentRepository.findAllWithUserAndDoctor();
            System.out.println("Direct query found: " + appointments.size() + " appointments");

            StringBuilder result = new StringBuilder();
            result.append("Found ").append(appointments.size()).append(" appointments:\n");

            for (Appointment apt : appointments) {
                result.append("ID: ").append(apt.getId())
                      .append(", Patient: ").append(apt.getUser() != null ? apt.getUser().getFirstName() + " " + apt.getUser().getLastName() : "NULL")
                      .append(", Doctor: ").append(apt.getDoctor() != null ? apt.getDoctor().getName() : "NULL")
                      .append(", Date: ").append(apt.getAppointmentDate())
                      .append(", Status: ").append(apt.getStatus())
                      .append("\n");
            }

            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            System.out.println("ERROR in test endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok("ERROR: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userUpdate) {
        return userRepository.findById(id)
                .map(user -> {
                    if (userUpdate.getFirstName() != null) {
                        user.setFirstName(userUpdate.getFirstName());
                    }
                    if (userUpdate.getLastName() != null) {
                        user.setLastName(userUpdate.getLastName());
                    }
                    if (userUpdate.getEmail() != null) {
                        user.setEmail(userUpdate.getEmail());
                    }
                    if (userUpdate.getPhone() != null) {
                        user.setPhone(userUpdate.getPhone());
                    }
                    if (userUpdate.getAddress() != null) {
                        user.setAddress(userUpdate.getAddress());
                    }
                    if (userUpdate.getRole() != null) {
                        user.setRole(userUpdate.getRole());
                    }
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}