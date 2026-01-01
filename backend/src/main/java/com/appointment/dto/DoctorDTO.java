package com.appointment.dto;

import com.appointment.entity.Doctor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DoctorDTO {
    private Long id;
    private String name;
    private String specialty;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;
    private String phone;
    private LocalDateTime createdAt;
    private Double distance;

    public DoctorDTO() {}

    public DoctorDTO(Doctor doctor) {
        this.id = doctor.getId();
        this.name = doctor.getName();
        this.specialty = doctor.getSpecialty();
        this.latitude = doctor.getLatitude();
        this.longitude = doctor.getLongitude();
        this.address = doctor.getAddress();
        this.phone = doctor.getPhone();
        this.createdAt = doctor.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }
}