package com.sliit.it3030.smartcampus.service;

import com.sliit.it3030.smartcampus.dto.resource.ResourceCreateRequest;
import com.sliit.it3030.smartcampus.dto.resource.ResourceUpdateRequest;
import com.sliit.it3030.smartcampus.model.Resource;
import com.sliit.it3030.smartcampus.model.ResourceStatus;
import com.sliit.it3030.smartcampus.model.ResourceType;
import com.sliit.it3030.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public Resource createResource(ResourceCreateRequest request) {
        validateAvailabilityWindow(request.getAvailableFrom(), request.getAvailableTo());

        Resource resource = Resource.builder()
                .name(request.getName().trim())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation().trim())
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .status(request.getStatus())
                .imageUrl(request.getImageUrl())
                .availableFrom(request.getAvailableFrom())
                .availableTo(request.getAvailableTo())
                .active(true)
                .build();

        return resourceRepository.save(resource);
    }

    public List<Resource> getResources(String type, String location, Integer minCapacity, String status) {
        List<Resource> resources = resourceRepository.findAll();

        return resources.stream()
                .filter(resource -> matchesType(resource, type))
                .filter(resource -> matchesLocation(resource, location))
                .filter(resource -> matchesMinCapacity(resource, minCapacity))
                .filter(resource -> matchesStatus(resource, status))
                .collect(Collectors.toList());
    }

    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Resource not found with id: " + id));
    }

    public Resource updateResource(String id, ResourceUpdateRequest request) {
        validateAvailabilityWindow(request.getAvailableFrom(), request.getAvailableTo());

        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Resource not found with id: " + id));

        existing.setName(request.getName().trim());
        existing.setType(request.getType());
        existing.setCapacity(request.getCapacity());
        existing.setLocation(request.getLocation().trim());
        existing.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        existing.setStatus(request.getStatus());
        existing.setImageUrl(request.getImageUrl());
        existing.setAvailableFrom(request.getAvailableFrom());
        existing.setAvailableTo(request.getAvailableTo());

        if (request.getActive() != null) {
            existing.setActive(request.getActive());
        }

        return resourceRepository.save(existing);
    }

    public void deleteResource(String id) {
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Resource not found with id: " + id));

        resourceRepository.delete(existing);
    }

    private boolean matchesType(Resource resource, String type) {
        if (type == null || type.isBlank()) {
            return true;
        }

        try {
            ResourceType requestedType = ResourceType.valueOf(type.trim().toUpperCase(Locale.ROOT));
            return resource.getType() == requestedType;
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid resource type: " + type);
        }
    }

    private boolean matchesLocation(Resource resource, String location) {
        if (location == null || location.isBlank()) {
            return true;
        }

        return resource.getLocation() != null &&
                resource.getLocation().toLowerCase(Locale.ROOT)
                        .contains(location.trim().toLowerCase(Locale.ROOT));
    }

    private boolean matchesMinCapacity(Resource resource, Integer minCapacity) {
        if (minCapacity == null) {
            return true;
        }

        return resource.getCapacity() != null && resource.getCapacity() >= minCapacity;
    }

    private boolean matchesStatus(Resource resource, String status) {
        if (status == null || status.isBlank()) {
            return true;
        }

        try {
            ResourceStatus requestedStatus = ResourceStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
            return resource.getStatus() == requestedStatus;
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid resource status: " + status);
        }
    }

    private void validateAvailabilityWindow(String availableFrom, String availableTo) {
        if ((availableFrom == null || availableFrom.isBlank()) &&
                (availableTo == null || availableTo.isBlank())) {
            return;
        }

        if (availableFrom == null || availableFrom.isBlank() ||
                availableTo == null || availableTo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Both availableFrom and availableTo must be provided together");
        }

        if (availableFrom.compareTo(availableTo) >= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "availableFrom must be earlier than availableTo");
        }
    }
}