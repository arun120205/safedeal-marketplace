package com.safedeal.service;

import com.safedeal.dto.*;
import com.safedeal.entity.User;
import com.safedeal.enums.KycStatus;
import com.safedeal.enums.Role;
import com.safedeal.repository.UserRepository;
import com.safedeal.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public String register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already registered!");
        if (userRepo.existsByPhone(request.getPhone()))
            throw new RuntimeException("Phone already registered!");

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // 🔐 hash!
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(Role.USER)
                .kycStatus(KycStatus.PENDING)
                .build();

        userRepo.save(user);
        return "Registration successful! Please complete KYC.";
    }

    public AuthResponse login(LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepo.findByEmail(request.getEmail()).orElseThrow();

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        return new AuthResponse(
                jwtUtil.generateToken(userDetails),
                user.getName(),
                user.getEmail(),
                user.getRole().name());
    }
}