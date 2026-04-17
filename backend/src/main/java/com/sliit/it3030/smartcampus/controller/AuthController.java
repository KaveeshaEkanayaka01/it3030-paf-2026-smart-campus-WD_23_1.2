package com.sliit.it3030.smartcampus.controller;

import com.sliit.it3030.smartcampus.dto.auth.AuthResponse;
import com.sliit.it3030.smartcampus.dto.auth.LoginRequest;
import com.sliit.it3030.smartcampus.dto.auth.UserInfoDto;
import com.sliit.it3030.smartcampus.model.User;
import com.sliit.it3030.smartcampus.repository.UserRepository;
import com.sliit.it3030.smartcampus.security.JwtService;
import com.sliit.it3030.smartcampus.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * GET /api/auth/me
     * Returns current logged-in user info
     * Used by frontend after OAuth callback
     */
    @GetMapping("/me")
    public ResponseEntity<UserInfoDto> getCurrentUser(
            @AuthenticationPrincipal User currentUser) {

        UserInfoDto userInfo = authService.getCurrentUserInfo(currentUser.getId());
        return ResponseEntity.ok(userInfo);
    }

    /**
     * GET /api/auth/github
     * Redirect to GitHub OAuth
     * Spring Security handles this automatically
     * Just document this endpoint for frontend
     */
    @GetMapping("/github")
    public ResponseEntity<String> githubLogin() {
        return ResponseEntity.ok("Redirect to: /oauth2/authorization/github");
    }

    /**
     * POST /api/auth/login
     * Local email/password login for admin (development convenience)
     * If `admin@gmail.com` signs in with `admin123`, an admin user will be created/returned.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Email and password are required");
        }

        String email = request.getEmail().toLowerCase().trim();
        String password = request.getPassword();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Allow creating the single admin account via credentials
            if ("admin@gmail.com".equalsIgnoreCase(email) && "admin123".equals(password)) {
                Set<String> roles = new HashSet<>();
                roles.add(User.ROLE_USER);
                roles.add(User.ROLE_ADMIN);

                user = User.builder()
                        .email(email)
                        .name("Admin")
                        .roles(roles)
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .password(passwordEncoder.encode(password))
                        .build();

                user = userRepository.save(user);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            // Validate password
            if (user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRoles());
        AuthResponse resp = authService.buildAuthResponse(user, token);

        return ResponseEntity.ok(resp);
    }
}