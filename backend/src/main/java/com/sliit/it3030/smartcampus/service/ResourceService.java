package com.sliit.it3030.smartcampus.service;

import com.sliit.it3030.smartcampus.dto.resource.ResourceCreateRequest;
import com.sliit.it3030.smartcampus.dto.resource.ResourceUpdateRequest;
import com.sliit.it3030.smartcampus.model.Resource;
import com.sliit.it3030.smartcampus.model.ResourceStatus;
import com.sliit.it3030.smartcampus.model.ResourceType;
import com.sliit.it3030.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    private static final Pattern TIME_PATTERN = Pattern.compile("^([01]\\d|2[0-3]):([0-5]\\d)$");

    private static final int GLOBAL_MIN_TIME = toMinutes("06:00");
    private static final int GLOBAL_MAX_TIME = toMinutes("22:00");
    private static final int MIN_DURATION_MINUTES = 30;
    private static final int MAX_DURATION_MINUTES = 12 * 60;

    private static final Map<ResourceType, TimeWindow> TYPE_WINDOWS = Map.of(
            ResourceType.LECTURE_HALL, new TimeWindow("07:00", "20:00"),
            ResourceType.LAB, new TimeWindow("08:00", "18:00"),
            ResourceType.MEETING_ROOM, new TimeWindow("08:00", "17:00"),
            ResourceType.EQUIPMENT, new TimeWindow("06:00", "22:00"));

    public Resource createResource(ResourceCreateRequest request) {
        validateAvailabilityWindow(request.getType(), request.getAvailableFrom(), request.getAvailableTo());

        Resource resource = Resource.builder()
                .name(request.getName().trim())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation().trim())
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .status(request.getStatus())
                .imageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : null)
                .availableFrom(request.getAvailableFrom())
                .availableTo(request.getAvailableTo())
                .active(true)
                .build();

        return resourceRepository.save(resource);
    }

    public List<Resource> getResources(String type, String location, Integer minCapacity, String status, String q) {
        List<Resource> resources = resourceRepository.findAll();

        return resources.stream()
                .filter(resource -> matchesType(resource, type))
                .filter(resource -> matchesLocation(resource, location))
                .filter(resource -> matchesMinCapacity(resource, minCapacity))
                .filter(resource -> matchesStatus(resource, status))
                .filter(resource -> matchesKeyword(resource, q))
                .collect(Collectors.toList());
    }

    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Resource not found with id: " + id));
    }

    public Resource updateResource(String id, ResourceUpdateRequest request) {
        validateAvailabilityWindow(request.getType(), request.getAvailableFrom(), request.getAvailableTo());

        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Resource not found with id: " + id));

        existing.setName(request.getName().trim());
        existing.setType(request.getType());
        existing.setCapacity(request.getCapacity());
        existing.setLocation(request.getLocation().trim());
        existing.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        existing.setStatus(request.getStatus());
        existing.setImageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : null);
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

        return resource.getLocation() != null
                && resource.getLocation().toLowerCase(Locale.ROOT)
                        .contains(location.trim().toLowerCase(Locale.ROOT));
    }

    private boolean matchesMinCapacity(Resource resource, Integer minCapacity) {
        if (minCapacity == null) {
            return true;
        }

        if (minCapacity < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "minCapacity cannot be negative");
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

    private boolean matchesKeyword(Resource resource, String q) {
        if (q == null || q.isBlank()) {
            return true;
        }

        String keyword = q.trim().toLowerCase(Locale.ROOT);

        return containsIgnoreCase(resource.getName(), keyword)
                || containsIgnoreCase(resource.getLocation(), keyword)
                || containsIgnoreCase(resource.getDescription(), keyword)
                || (resource.getType() != null
                        && resource.getType().name().toLowerCase(Locale.ROOT).contains(keyword));
    }

    private boolean containsIgnoreCase(String value, String keyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(keyword);
    }

    private void validateAvailabilityWindow(ResourceType resourceType, String availableFrom, String availableTo) {
        boolean fromMissing = availableFrom == null || availableFrom.isBlank();
        boolean toMissing = availableTo == null || availableTo.isBlank();

        if (fromMissing && toMissing) {
            return;
        }

        if (fromMissing || toMissing) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Both availableFrom and availableTo must be provided together");
        }

        String from = availableFrom.trim();
        String to = availableTo.trim();

        if (!TIME_PATTERN.matcher(from).matches() || !TIME_PATTERN.matcher(to).matches()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Time must be in HH:mm format");
        }

        int fromMinutes = toMinutes(from);
        int toMinutes = toMinutes(to);

        if (fromMinutes >= toMinutes) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "availableFrom must be earlier than availableTo");
        }

        int duration = toMinutes - fromMinutes;

        if (duration < MIN_DURATION_MINUTES) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Availability duration must be at least 30 minutes");
        }

        if (duration > MAX_DURATION_MINUTES) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Availability duration cannot exceed 12 hours");
        }

        if (fromMinutes < GLOBAL_MIN_TIME || toMinutes > GLOBAL_MAX_TIME) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Availability time must be between 06:00 and 22:00");
        }

        if (resourceType != null && TYPE_WINDOWS.containsKey(resourceType)) {
            TimeWindow window = TYPE_WINDOWS.get(resourceType);
            int typeMin = toMinutes(window.from());
            int typeMax = toMinutes(window.to());

            if (fromMinutes < typeMin || toMinutes > typeMax) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        resourceType.name() + " resources must be available only between "
                                + window.from() + " and " + window.to());
            }
        }
    }

    private static int toMinutes(String time) {
        String[] parts = time.split(":");
        int hours = Integer.parseInt(parts[0]);
        int minutes = Integer.parseInt(parts[1]);
        return (hours * 60) + minutes;
    }

    private record TimeWindow(String from, String to) {
    }
}