package com.sliit.it3030.smartcampus.service;

import com.sliit.it3030.smartcampus.dto.auth.AuthResponseDto;
import com.sliit.it3030.smartcampus.dto.auth.LoginRequestDto;
import com.sliit.it3030.smartcampus.dto.auth.RegisterRequestDto;
import com.sliit.it3030.smartcampus.dto.auth.SetPasswordRequestDto;
import com.sliit.it3030.smartcampus.exception.ConflictException;
import com.sliit.it3030.smartcampus.exception.ResourceNotFoundException;
import com.sliit.it3030.smartcampus.model.User;
import com.sliit.it3030.smartcampus.repository.UserRepository;
import com.sliit.it3030.smartcampus.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDto register(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email is already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .department(request.getDepartment())
                .phoneNumber(request.getPhoneNumber())
                .role("STUDENT")
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole());

        return AuthResponseDto.builder()
                .token(token)
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole())
                .message("Registration successful")
                .requiresPasswordSetup(false)
                .build();
    }

    public AuthResponseDto login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new BadCredentialsException(
                    "This account was created with Google. Please continue with Google or set a password first.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return AuthResponseDto.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .message("Login successful")
                .requiresPasswordSetup(false)
                .build();
    }

    public User findOrCreateOAuthUser(String email, String fullName) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .fullName(fullName != null ? fullName : "Google User")
                    .password(null)
                    .role("STUDENT")
                    .active(true)
                    .build();

            return userRepository.save(newUser);
        });
    }

    public String setPassword(String userEmail, SetPasswordRequestDto request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new IllegalArgumentException("New password cannot be empty");
        }

        if (request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()) {
            throw new IllegalArgumentException("Confirm password cannot be empty");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password set successfully";
    }
}