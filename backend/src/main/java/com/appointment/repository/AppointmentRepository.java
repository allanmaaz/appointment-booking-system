package com.appointment.repository;

import com.appointment.entity.Appointment;
import com.appointment.entity.Doctor;
import com.appointment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query("SELECT a FROM Appointment a JOIN FETCH a.user JOIN FETCH a.doctor WHERE a.user = :user ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByUserOrderByAppointmentDateDescAppointmentTimeDesc(@Param("user") User user);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.user JOIN FETCH a.doctor WHERE a.doctor = :doctor ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByDoctorOrderByAppointmentDateDescAppointmentTimeDesc(@Param("doctor") Doctor doctor);

    Optional<Appointment> findByDoctorAndAppointmentDateAndAppointmentTime(
            Doctor doctor, LocalDate appointmentDate, LocalTime appointmentTime);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.user JOIN FETCH a.doctor WHERE a.doctor = :doctor AND a.appointmentDate = :date AND a.status = 'BOOKED'")
    List<Appointment> findBookedAppointmentsByDoctorAndDate(
            @Param("doctor") Doctor doctor, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.user JOIN FETCH a.doctor WHERE a.user = :user AND a.status = 'BOOKED' ORDER BY a.appointmentDate ASC, a.appointmentTime ASC")
    List<Appointment> findActiveAppointmentsByUser(@Param("user") User user);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.user JOIN FETCH a.doctor WHERE a.id = :id")
    Optional<Appointment> findByIdWithUserAndDoctor(@Param("id") Long id);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.user JOIN FETCH a.doctor ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findAllWithUserAndDoctor();

    long countByStatus(Appointment.AppointmentStatus status);
}