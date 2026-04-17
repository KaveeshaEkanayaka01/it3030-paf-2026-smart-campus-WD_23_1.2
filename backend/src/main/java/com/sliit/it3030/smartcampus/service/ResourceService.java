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
        String name = requestDto.getName().trim();
        String location = requestDto.getLocation().trim();

        boolean exists = resourceRepository.existsByNameIgnoreCaseAndLocationIgnoreCase(name, location);
        if (exists) {
            throw new IllegalArgumentException("A resource with the same name and location already exists");
        }

        Resource resource = Resource.builder()
                .name(name)
                .type(requestDto.getType().trim())
                .description(requestDto.getDescription().trim())
                .location(location)
                .capacity(requestDto.getCapacity())
                .available(requestDto.getAvailable() != null ? requestDto.getAvailable() : true)
                .imageUrl(
                        requestDto.getImageUrl() != null && !requestDto.getImageUrl().trim().isEmpty()
                                ? requestDto.getImageUrl().trim()
                                : null)
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

        String name = requestDto.getName().trim();
        String location = requestDto.getLocation().trim();

        resourceRepository.findByNameIgnoreCaseAndLocationIgnoreCase(name, location)
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new IllegalArgumentException(
                                "Another resource with the same name and location already exists");
                    }
                });

        resource.setName(name);
        resource.setType(requestDto.getType().trim());
        resource.setDescription(requestDto.getDescription().trim());
        resource.setLocation(location);
        resource.setCapacity(requestDto.getCapacity());
        resource.setAvailable(requestDto.getAvailable() != null ? requestDto.getAvailable() : resource.isAvailable());
        resource.setImageUrl(
                requestDto.getImageUrl() != null && !requestDto.getImageUrl().trim().isEmpty()
                        ? requestDto.getImageUrl().trim()
                        : null);

        Resource updated = resourceRepository.save(resource);
        return mapToDto(updated);
    }

    public void deleteResource(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resourceRepository.delete(resource);
    }

    private ResourceResponseDto mapToDto(Resource resource) {
        return new ResourceResponseDto(
                resource.getId(),
                resource.getName(),
                resource.getType(),
                resource.getDescription(),
                resource.getLocation(),
                resource.getCapacity(),
                resource.isAvailable(),
                resource.getImageUrl());
    }
}