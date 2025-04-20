// backend/src/main/java/com/casino/backend/service/AuthService.java
package com.casino.backend.service;

import com.casino.backend.dto.AuthResponse;
import com.casino.backend.dto.LoginRequest;
import com.casino.backend.dto.RegisterRequest;
import com.casino.backend.model.User;
import com.casino.backend.repository.UserRepository;
import com.casino.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setMobile(request.getMobile());
        user.setAadhaar(request.getAadhaar());

        // Save user
        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        // Create response
        AuthResponse response = new AuthResponse();
        response.setId(savedUser.getId());
        response.setEmail(savedUser.getEmail());
        response.setName(savedUser.getName());
        response.setMobile(savedUser.getMobile());
        response.setAadhaar(savedUser.getAadhaar());
        response.setBalance(savedUser.getBalance());
        response.setToken(token);

        return response;
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOptional.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        // Create response
        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setMobile(user.getMobile());
        response.setAadhaar(user.getAadhaar());
        response.setBalance(user.getBalance());
        response.setToken(token);

        return response;
    }
}