package com.sliit.it3030.smartcampus.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {

    private String id;
    private String fullName;
    private String email;
    private String role;
    private String profileImageUrl;
    private String department;
    private String phoneNumber;
    private boolean active;
}