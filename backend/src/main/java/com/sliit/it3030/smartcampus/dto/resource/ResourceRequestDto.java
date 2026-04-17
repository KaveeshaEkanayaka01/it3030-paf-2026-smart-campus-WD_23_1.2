package com.sliit.it3030.smartcampus.dto.resource;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequestDto {

    @NotBlank(message = "Resource name is required")
    @Size(min = 3, max = 100, message = "Resource name must be between 3 and 100 characters")
    private String name;

    @NotBlank(message = "Type is required")
    @Size(min = 2, max = 50, message = "Type must be between 2 and 50 characters")
    private String type;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;

    @NotBlank(message = "Location is required")
    @Size(min = 2, max = 100, message = "Location must be between 2 and 100 characters")
    private String location;

    @Min(value = 0, message = "Capacity cannot be negative")
    @Max(value = 10000, message = "Capacity cannot exceed 10000")
    private Integer capacity;

    private Boolean available;

    @Pattern(regexp = "^(|https?://.+)$", message = "Image URL must be a valid http or https URL")
    private String imageUrl;
}