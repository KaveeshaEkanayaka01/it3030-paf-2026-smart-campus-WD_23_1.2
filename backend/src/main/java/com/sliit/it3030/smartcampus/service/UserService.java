package com.sliit.it3030.smartcampus.service;

import com.sliit.it3030.smartcampus.dto.auth.RoleUpdateRequest;
import com.sliit.it3030.smartcampus.dto.auth.UserInfoDto;
import com.sliit.it3030.smartcampus.exception.ConflictException;
import com.sliit.it3030.smartcampus.exception.ResourceNotFoundException;
import com.sliit.it3030.smartcampus.model.User;
import com.sliit.it3030.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;

    // Valid roles
    private static final Set<String> VALID_ROLES = Set.of(
            User.ROLE_USER, User.ROLE_ADMIN, User.ROLE_TECHNICIAN
    );

    // Get all users (ADMIN only)
    public List<UserInfoDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(authService::mapToUserInfoDto)
                .collect(Collectors.toList());
    }

    // Get user by ID
    public UserInfoDto getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        return authService.mapToUserInfoDto(user);
    }

    // Get all active technicians
    public List<UserInfoDto> getTechnicians() {
        return userRepository.findByRolesContaining(User.ROLE_TECHNICIAN).stream()
                .filter(User::isActive)
                .sorted(Comparator.comparing((User user) -> String.valueOf(user.getName()).toLowerCase())
                        .thenComparing(User::getId))
                .map(authService::mapToUserInfoDto)
                .collect(Collectors.toList());
    }

    // Update user role (ADMIN only)
    public UserInfoDto updateUserRole(String userId, RoleUpdateRequest request) {
        // Validate role
        if (!VALID_ROLES.contains(request.getRole())) {
            throw new ConflictException("Invalid role: " + request.getRole());
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if ("ADD".equalsIgnoreCase(request.getAction())) {
            user.getRoles().add(request.getRole());
            log.info("Added role {} to user {}", request.getRole(), userId);
        } else if ("REMOVE".equalsIgnoreCase(request.getAction())) {
            // Prevent removing last role
            if (user.getRoles().size() <= 1) {
                throw new ConflictException("Cannot remove the last role from user");
            }
            user.getRoles().remove(request.getRole());
            log.info("Removed role {} from user {}", request.getRole(), userId);
        } else {
            throw new ConflictException("Invalid action. Use ADD or REMOVE");
        }

        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        return authService.mapToUserInfoDto(savedUser);
    }
}