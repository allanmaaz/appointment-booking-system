package com.appointment.repository;

import com.appointment.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialtyContainingIgnoreCase(String specialty);

    @Query("SELECT d FROM Doctor d WHERE " +
           "(:specialty IS NULL OR LOWER(d.specialty) LIKE LOWER(CONCAT('%', :specialty, '%')))")
    List<Doctor> findDoctorsBySpecialty(@Param("specialty") String specialty);

    @Query(value = "SELECT *, " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(d.latitude)) * " +
           "cos(radians(d.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(d.latitude)))) AS distance " +
           "FROM doctors d ORDER BY distance ASC " +
           "LIMIT :limit", nativeQuery = true)
    List<Doctor> findNearbyDoctors(@Param("latitude") BigDecimal latitude,
                                   @Param("longitude") BigDecimal longitude,
                                   @Param("limit") int limit);
}