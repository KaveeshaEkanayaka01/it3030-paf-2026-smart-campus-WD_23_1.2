package com.sliit.it3030.smartcampus.controller;

import com.sliit.it3030.smartcampus.dto.resource.ResourceRequestDto;
import com.sliit.it3030.smartcampus.dto.resource.ResourceResponseDto;
import com.sliit.it3030.smartcampus.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ResourceResponseDto> createResource(@Valid @RequestBody ResourceRequestDto requestDto) {
        return ResponseEntity.ok(resourceService.createResource(requestDto));
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponseDto>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDto> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @GetMapping("/available")
    public ResponseEntity<List<ResourceResponseDto>> getAvailableResources() {
        return ResponseEntity.ok(resourceService.getAvailableResources());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ResourceResponseDto>> getResourcesByType(@PathVariable String type) {
        return ResponseEntity.ok(resourceService.getResourcesByType(type));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ResourceResponseDto>> searchResources(@RequestParam String keyword) {
        return ResponseEntity.ok(resourceService.searchResources(keyword));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDto> updateResource(
            @PathVariable String id,
            @Valid @RequestBody ResourceRequestDto requestDto) {
        return ResponseEntity.ok(resourceService.updateResource(id, requestDto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok("Resource deleted successfully");
    }
}