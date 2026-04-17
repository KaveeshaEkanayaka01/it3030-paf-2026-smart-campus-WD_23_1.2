package com.sliit.it3030.smartcampus.controller;

import com.sliit.it3030.smartcampus.dto.auth.UserInfoDto;
import com.sliit.it3030.smartcampus.model.User;
import com.sliit.it3030.smartcampus.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
}