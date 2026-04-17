package com.sliit.it3030.smartcampus.util;

import com.sliit.it3030.smartcampus.dto.resource.ResourceRequestDto;
import com.sliit.it3030.smartcampus.dto.resource.ResourceResponseDto;
import com.sliit.it3030.smartcampus.model.Resource;

public class MapperUtil {

    // Convert DTO → Entity
    public static Resource toEntity(ResourceRequestDto dto) {
        if (dto == null)
            return null;

        return Resource.builder()
                .name(dto.getName())
                .type(dto.getType())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .capacity(dto.getCapacity())
                .available(dto.getAvailable() != null ? dto.getAvailable() : true)
                .imageUrl(dto.getImageUrl())
                .build();
    }

    // Convert Entity → DTO
    public static ResourceResponseDto toDto(Resource resource) {
        if (resource == null)
            return null;

        return ResourceResponseDto.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .description(resource.getDescription())
                .location(resource.getLocation())
                .capacity(resource.getCapacity())
                .available(resource.isAvailable())
                .imageUrl(resource.getImageUrl())
                .build();
    }
}