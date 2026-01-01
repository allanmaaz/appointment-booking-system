package com.appointment.config;

import com.appointment.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.oauth2.core.user.OAuth2User; // Temporarily commented out
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;


    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/login/oauth2/**").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/login").permitAll()
                .requestMatchers("/api/doctors/**").permitAll()
                .requestMatchers("/api/appointments/**").authenticated()
                .anyRequest().authenticated()
            )
            // Temporarily commented out OAuth2 login until credentials are configured
            // .oauth2Login(oauth2 -> oauth2
            //     .successHandler((request, response, authentication) -> {
            //         try {
            //             OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            //             String email = oauth2User.getAttribute("email");
            //             String firstName = oauth2User.getAttribute("given_name");
            //             String lastName = oauth2User.getAttribute("family_name");

            //             if (email == null) {
            //                 response.sendRedirect("http://localhost:5177/login?error=no_email");
            //                 return;
            //             }

            //             // Find or create user
            //             Optional<User> existingUser = userRepository.findByEmail(email);
            //             User user;

            //             if (existingUser.isPresent()) {
            //                 user = existingUser.get();
            //             } else {
            //                 user = new User();
            //                 user.setEmail(email);
            //                 user.setFirstName(firstName != null ? firstName : "Google");
            //                 user.setLastName(lastName != null ? lastName : "User");
            //                 user.setPassword("");
            //                 user = userRepository.save(user);
            //             }

            //             String token = jwtUtil.generateToken(email);

            //             String redirectUrl = String.format(
            //                 "http://localhost:5177/auth/google/callback?token=%s&email=%s&firstName=%s&lastName=%s&userId=%d&role=%s",
            //                 token, email,
            //                 user.getFirstName() != null ? user.getFirstName() : "",
            //                 user.getLastName() != null ? user.getLastName() : "",
            //                 user.getId(),
            //                 user.getRole().name()
            //             );

            //             response.sendRedirect(redirectUrl);
            //         } catch (Exception e) {
            //             e.printStackTrace();
            //             try {
            //                 response.sendRedirect("http://localhost:5177/login?error=oauth_failed");
            //             } catch (IOException ioException) {
            //                 ioException.printStackTrace();
            //             }
            //         }
            //     })
            //     .failureUrl("http://localhost:5177/login?error=oauth_error")
            // )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}