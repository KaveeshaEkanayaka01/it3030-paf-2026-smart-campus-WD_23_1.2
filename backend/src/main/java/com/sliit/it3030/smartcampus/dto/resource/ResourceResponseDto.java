package com.sliit.it3030.smartcampus.dto.resource;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceResponseDto {

    private String id;
    private String name;
    private String type;
    private String description;
    private String location;
    private Integer capacity;
    private boolean available;
    private String imageUrl;
}