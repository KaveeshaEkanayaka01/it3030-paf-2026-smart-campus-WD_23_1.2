package com.sliit.it3030.smartcampus.controller;

import com.sliit.it3030.smartcampus.dto.auth.RoleUpdateRequest;
import com.sliit.it3030.smartcampus.dto.auth.UserInfoDto;
import com.sliit.it3030.smartcampus.model.User;
import com.sliit.it3030.smartcampus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * GET /api/users
     * Get all users - ADMIN only
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<UserInfoDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * GET /api/users/technicians
     * Get all active technicians for ticket assignment
     */
    @GetMapping("/technicians")
    public ResponseEntity<List<UserInfoDto>> getTechnicians() {
        return ResponseEntity.ok(userService.getTechnicians());
    }

    /**
     * GET /api/users/{id}
     * Get user by ID - ADMIN or self
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserInfoDto> getUserById(
            @PathVariable String id,
            @AuthenticationPrincipal User currentUser) {

        // Allow if ADMIN or requesting own profile
        if (!currentUser.getRoles().contains(User.ROLE_ADMIN) &&
                !currentUser.getId().equals(id)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(userService.getUserById(id));
    }

    /**
     * PUT /api/users/{id}/role
     * Update user role - ADMIN only
     */
    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserInfoDto> updateUserRole(
            @PathVariable String id,
            @Valid @RequestBody RoleUpdateRequest request) {

        return ResponseEntity.ok(userService.updateUserRole(id, request));
    }
}