package com.sliit.it3030.smartcampus.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequestDto {

    private String fullName;
    private String profileImageUrl;
    private String department;
    private String phoneNumber;
}