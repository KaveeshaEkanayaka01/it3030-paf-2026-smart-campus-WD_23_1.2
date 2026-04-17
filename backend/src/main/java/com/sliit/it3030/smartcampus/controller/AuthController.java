package com.sliit.it3030.smartcampus.controller;

import com.sliit.it3030.smartcampus.dto.auth.AuthResponseDto;
import com.sliit.it3030.smartcampus.dto.auth.LoginRequestDto;
import com.sliit.it3030.smartcampus.dto.auth.RegisterRequestDto;
import com.sliit.it3030.smartcampus.dto.auth.SetPasswordRequestDto;
import com.sliit.it3030.smartcampus.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterRequestDto request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(
            @RequestBody SetPasswordRequestDto request,
            Authentication authentication) {
        String email = authentication.getName();

        String message = authService.setPassword(email, request);

        return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", message));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is running");
    }
}