package com.appointment.controller;

import com.appointment.dto.LoginResponse;
import com.appointment.entity.User;
import com.appointment.repository.UserRepository;
import com.appointment.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175", "http://127.0.0.1:5176"})
public class OAuth2Controller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/google/callback")
    public ResponseEntity<?> googleCallback(@AuthenticationPrincipal OAuth2User principal) {
        try {
            String email = principal.getAttribute("email");
            String firstName = principal.getAttribute("given_name");
            String lastName = principal.getAttribute("family_name");

            if (email == null) {
                return ResponseEntity.badRequest().body("{\"message\":\"Email not provided by Google\"}");
            }

            // Find or create user
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
            } else {
                // Create new user
                user = new User();
                user.setEmail(email);
                user.setFirstName(firstName != null ? firstName : "Google");
                user.setLastName(lastName != null ? lastName : "User");
                // No password needed for OAuth users
                user.setPassword("");
                user = userRepository.save(user);
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(email);

            // Create response
            LoginResponse response = new LoginResponse();
            response.setToken(token);
            response.setEmail(user.getEmail());
            response.setFirstName(user.getFirstName());
            response.setLastName(user.getLastName());
            response.setUserId(user.getId());
            response.setRole(user.getRole().name());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("{\"message\":\"Google OAuth authentication failed\"}");
        }
    }

    @GetMapping("/google/user")
    public ResponseEntity<?> getGoogleUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.badRequest().body("{\"message\":\"Not authenticated with Google\"}");
        }
        return ResponseEntity.ok(principal.getAttributes());
    }
}