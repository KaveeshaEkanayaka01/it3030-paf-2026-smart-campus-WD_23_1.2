package com.sliit.it3030.smartcampus.dto.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequestDto {

    private String name;
    private String type;
    private String description;
    private String location;
    private Integer capacity;
    private Boolean available;
    private String imageUrl;
}