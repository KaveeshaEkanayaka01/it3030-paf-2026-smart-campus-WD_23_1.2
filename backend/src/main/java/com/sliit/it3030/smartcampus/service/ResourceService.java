package com.sliit.it3030.smartcampus.service;

import com.sliit.it3030.smartcampus.dto.resource.ResourceRequestDto;
import com.sliit.it3030.smartcampus.dto.resource.ResourceResponseDto;
import com.sliit.it3030.smartcampus.exception.ResourceNotFoundException;
import com.sliit.it3030.smartcampus.model.Resource;
import com.sliit.it3030.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceResponseDto createResource(ResourceRequestDto requestDto) {
        Resource resource = Resource.builder()
                .name(requestDto.getName())
                .type(requestDto.getType())
                .description(requestDto.getDescription())
                .location(requestDto.getLocation())
                .capacity(requestDto.getCapacity())
                .available(requestDto.getAvailable() != null ? requestDto.getAvailable() : true)
                .imageUrl(requestDto.getImageUrl())
                .build();

        Resource saved = resourceRepository.save(resource);
        return mapToDto(saved);
    }

    public List<ResourceResponseDto> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public ResourceResponseDto getResourceById(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        return mapToDto(resource);
    }

    public List<ResourceResponseDto> getAvailableResources() {
        return resourceRepository.findByAvailable(true)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<ResourceResponseDto> getResourcesByType(String type) {
        return resourceRepository.findByTypeIgnoreCase(type)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<ResourceResponseDto> searchResources(String keyword) {
        return resourceRepository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public ResourceResponseDto updateResource(String id, ResourceRequestDto requestDto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        if (requestDto.getName() != null) {
            resource.setName(requestDto.getName());
        }
        if (requestDto.getType() != null) {
            resource.setType(requestDto.getType());
        }
        if (requestDto.getDescription() != null) {
            resource.setDescription(requestDto.getDescription());
        }
        if (requestDto.getLocation() != null) {
            resource.setLocation(requestDto.getLocation());
        }
        if (requestDto.getCapacity() != null) {
            resource.setCapacity(requestDto.getCapacity());
        }
        if (requestDto.getAvailable() != null) {
            resource.setAvailable(requestDto.getAvailable());
        }
        if (requestDto.getImageUrl() != null) {
            resource.setImageUrl(requestDto.getImageUrl());
        }

        Resource updated = resourceRepository.save(resource);
        return mapToDto(updated);
    }

    public void deleteResource(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resourceRepository.delete(resource);
    }

    private ResourceResponseDto mapToDto(Resource resource) {
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