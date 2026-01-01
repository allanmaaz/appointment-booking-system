package com.appointment.service;

import com.appointment.dto.LoginRequest;
import com.appointment.dto.LoginResponse;
import com.appointment.entity.User;
import com.appointment.repository.UserRepository;
import com.appointment.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Objects;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(user.getEmail());

            return new LoginResponse(token, user.getEmail(), user.getFirstName(), user.getLastName(), user.getId(), user.getRole().name());

        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid email or password");
        }
    }

    public User register(String firstName, String lastName, String email, String password, String role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        // Set role, default to USER if not provided or invalid
        if (role != null && !role.isEmpty()) {
            try {
                user.setRole(User.Role.valueOf(role.toUpperCase()));
            } catch (IllegalArgumentException e) {
                user.setRole(User.Role.USER);
            }
        } else {
            user.setRole(User.Role.USER);
        }

        return userRepository.save(user);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserLocation(String email, Double latitude, Double longitude, String address, String city, String state, String country) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLatitude(latitude);
        user.setLongitude(longitude);
        user.setAddress(address);
        user.setCity(city);
        user.setState(state);
        user.setCountry(country);

        return userRepository.save(user);
    }

    public User updateUserProfile(String email, String phone, String address) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (phone != null && !phone.isEmpty()) {
            user.setPhone(phone);
        }
        if (address != null && !address.isEmpty()) {
            user.setAddress(address);
        }

        return Objects.requireNonNull(userRepository.save(user));
    }
}