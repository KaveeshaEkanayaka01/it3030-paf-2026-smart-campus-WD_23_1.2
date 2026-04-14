package com.sliit.it3030.smartcampus.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetPasswordRequestDto {
    private String newPassword;
    private String confirmPassword;
}