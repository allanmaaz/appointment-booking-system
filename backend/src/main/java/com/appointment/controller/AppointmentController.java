package com.appointment.controller;

import com.appointment.dto.AppointmentDTO;
import com.appointment.dto.CreateAppointmentRequest;
import com.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175", "http://127.0.0.1:5176", "http://127.0.0.1:5177"})
public class AppointmentController {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentController.class);

    @Autowired
    private AppointmentService appointmentService;

    private ResponseEntity<Map<String, Object>> createErrorResponse(HttpStatus status, String message, Exception e) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", true);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", System.currentTimeMillis());

        if (e != null) {
            logger.error("Error in AppointmentController: {}", message, e);
        } else {
            logger.warn("AppointmentController warning: {}", message);
        }

        return new ResponseEntity<>(errorResponse, status);
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(
            @Valid @RequestBody CreateAppointmentRequest request,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            if (userEmail == null || userEmail.trim().isEmpty()) {
                return createErrorResponse(HttpStatus.UNAUTHORIZED, "Authentication required", null);
            }

            AppointmentDTO appointment = appointmentService.createAppointment(request, userEmail);
            return ResponseEntity.ok(appointment);
        } catch (IllegalArgumentException e) {
            return createErrorResponse(HttpStatus.BAD_REQUEST, "Invalid appointment request: " + e.getMessage(), e);
        } catch (RuntimeException e) {
            String message = e.getMessage();
            if (message != null && message.toLowerCase().contains("not found")) {
                return createErrorResponse(HttpStatus.NOT_FOUND, message, e);
            }
            return createErrorResponse(HttpStatus.BAD_REQUEST, "Failed to create appointment: " + message, e);
        } catch (Exception e) {
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred while creating appointment", e);
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserAppointments(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            if (userEmail == null || userEmail.trim().isEmpty()) {
                return createErrorResponse(HttpStatus.UNAUTHORIZED, "Authentication required", null);
            }

            List<AppointmentDTO> appointments = appointmentService.getUserAppointments(userEmail);
            return ResponseEntity.ok(appointments);
        } catch (RuntimeException e) {
            String message = e.getMessage();
            if (message != null && message.toLowerCase().contains("not found")) {
                return createErrorResponse(HttpStatus.NOT_FOUND, message, e);
            }
            return createErrorResponse(HttpStatus.BAD_REQUEST, "Failed to fetch appointments: " + message, e);
        } catch (Exception e) {
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred while fetching appointments", e);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveUserAppointments(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            if (userEmail == null || userEmail.trim().isEmpty()) {
                return createErrorResponse(HttpStatus.UNAUTHORIZED, "Authentication required", null);
            }

            List<AppointmentDTO> appointments = appointmentService.getActiveUserAppointments(userEmail);
            return ResponseEntity.ok(appointments);
        } catch (RuntimeException e) {
            String message = e.getMessage();
            if (message != null && message.toLowerCase().contains("not found")) {
                return createErrorResponse(HttpStatus.NOT_FOUND, message, e);
            }
            return createErrorResponse(HttpStatus.BAD_REQUEST, "Failed to fetch active appointments: " + message, e);
        } catch (Exception e) {
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred while fetching active appointments", e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            if (userEmail == null || userEmail.trim().isEmpty()) {
                return createErrorResponse(HttpStatus.UNAUTHORIZED, "Authentication required", null);
            }

            if (id == null || id <= 0) {
                return createErrorResponse(HttpStatus.BAD_REQUEST, "Invalid appointment ID", null);
            }

            AppointmentDTO appointment = appointmentService.getAppointmentById(id, userEmail);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            String message = e.getMessage();
            if (message != null && message.toLowerCase().contains("not found")) {
                return createErrorResponse(HttpStatus.NOT_FOUND, "Appointment not found", e);
            }
            return createErrorResponse(HttpStatus.BAD_REQUEST, "Failed to fetch appointment: " + message, e);
        } catch (Exception e) {
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred while fetching appointment", e);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            if (userEmail == null || userEmail.trim().isEmpty()) {
                return createErrorResponse(HttpStatus.UNAUTHORIZED, "Authentication required", null);
            }

            if (id == null || id <= 0) {
                return createErrorResponse(HttpStatus.BAD_REQUEST, "Invalid appointment ID", null);
            }

            AppointmentDTO appointment = appointmentService.cancelAppointment(id, userEmail);
            return ResponseEntity.ok(appointment);
        } catch (IllegalArgumentException e) {
            return createErrorResponse(HttpStatus.BAD_REQUEST, "Invalid cancellation request: " + e.getMessage(), e);
        } catch (RuntimeException e) {
            String message = e.getMessage();
            if (message != null && message.toLowerCase().contains("not found")) {
                return createErrorResponse(HttpStatus.NOT_FOUND, "Appointment not found", e);
            }
            if (message != null && (message.toLowerCase().contains("cannot cancel") || message.toLowerCase().contains("already cancelled"))) {
                return createErrorResponse(HttpStatus.CONFLICT, message, e);
            }
            return createErrorResponse(HttpStatus.BAD_REQUEST, "Failed to cancel appointment: " + message, e);
        } catch (Exception e) {
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred while canceling appointment", e);
        }
    }
}