package com.appointment.dto;

import com.appointment.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;

public class AdminAppointmentDTO {
    private Long id;
    private String patientFirstName;
    private String patientLastName;
    private String patientEmail;
    private String doctorName;
    private String doctorSpecialty;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;

    public AdminAppointmentDTO() {}

    public AdminAppointmentDTO(Appointment appointment) {
        this.id = appointment.getId();

        if (appointment.getUser() != null) {
            this.patientFirstName = appointment.getUser().getFirstName();
            this.patientLastName = appointment.getUser().getLastName();
            this.patientEmail = appointment.getUser().getEmail();
        }

        if (appointment.getDoctor() != null) {
            this.doctorName = appointment.getDoctor().getName();
            this.doctorSpecialty = appointment.getDoctor().getSpecialty();
        }

        this.appointmentDate = appointment.getAppointmentDate();
        this.appointmentTime = appointment.getAppointmentTime();
        this.status = appointment.getStatus() != null ? appointment.getStatus().toString() : "UNKNOWN";
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientFirstName() { return patientFirstName; }
    public void setPatientFirstName(String patientFirstName) { this.patientFirstName = patientFirstName; }

    public String getPatientLastName() { return patientLastName; }
    public void setPatientLastName(String patientLastName) { this.patientLastName = patientLastName; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDoctorSpecialty() { return doctorSpecialty; }
    public void setDoctorSpecialty(String doctorSpecialty) { this.doctorSpecialty = doctorSpecialty; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // Helper method to get full patient name for frontend compatibility
    public String getPatientName() {
        if (patientFirstName != null && patientLastName != null) {
            return patientFirstName + " " + patientLastName;
        } else if (patientFirstName != null) {
            return patientFirstName;
        } else if (patientLastName != null) {
            return patientLastName;
        }
        return "Unknown Patient";
    }
}