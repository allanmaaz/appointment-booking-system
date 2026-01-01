package com.appointment.controller;

import com.appointment.dto.LoginRequest;
import com.appointment.dto.LoginResponse;
import com.appointment.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175", "http://127.0.0.1:5176", "http://127.0.0.1:5177"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse("Authentication failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.register(
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getEmail(),
                registerRequest.getPassword(),
                registerRequest.getRole()
            );
            SuccessResponse successResponse = new SuccessResponse("User registered successfully");
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse("Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    public static class ErrorResponse {
        public final String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }

    public static class SuccessResponse {
        public final String message;

        public SuccessResponse(String message) {
            this.message = message;
        }
    }

    public static class RegisterRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String role;

        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getEmail() { return email; }
        public String getPassword() { return password; }
        public String getRole() { return role; }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            String email = extractEmailFromToken(token);
            var user = authService.getCurrentUser(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @PostMapping("/location")
    public ResponseEntity<?> updateUserLocation(@RequestHeader("Authorization") String token, @RequestBody LocationUpdateRequest request) {
        try {
            String email = extractEmailFromToken(token);
            authService.updateUserLocation(
                email,
                request.getLatitude(),
                request.getLongitude(),
                request.getAddress(),
                request.getCity(),
                request.getState(),
                request.getCountry()
            );
            return ResponseEntity.ok(new SuccessResponse("Location updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to update location: " + e.getMessage()));
        }
    }

    @PostMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestHeader("Authorization") String token, @RequestBody ProfileUpdateRequest request) {
        try {
            String email = extractEmailFromToken(token);
            authService.updateUserProfile(email, request.getPhone(), request.getAddress());
            return ResponseEntity.ok(new SuccessResponse("Profile updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to update profile: " + e.getMessage()));
        }
    }

    private String extractEmailFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new RuntimeException("Invalid token format");
    }

    public static class LocationUpdateRequest {
        private Double latitude;
        private Double longitude;
        private String address;
        private String city;
        private String state;
        private String country;

        public Double getLatitude() { return latitude; }
        public Double getLongitude() { return longitude; }
        public String getAddress() { return address; }
        public String getCity() { return city; }
        public String getState() { return state; }
        public String getCountry() { return country; }

        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
        public void setAddress(String address) { this.address = address; }
        public void setCity(String city) { this.city = city; }
        public void setState(String state) { this.state = state; }
        public void setCountry(String country) { this.country = country; }
    }

    public static class ProfileUpdateRequest {
        private String phone;
        private String address;

        public String getPhone() { return phone; }
        public String getAddress() { return address; }

        public void setPhone(String phone) { this.phone = phone; }
        public void setAddress(String address) { this.address = address; }
    }
}