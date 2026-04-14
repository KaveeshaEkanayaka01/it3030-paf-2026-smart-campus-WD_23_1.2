package com.sliit.it3030.smartcampus.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDto {
    private String token;
    private String email;
    private String fullName;
    private String role;
    private String message;

    private boolean requiresPasswordSetup;
}