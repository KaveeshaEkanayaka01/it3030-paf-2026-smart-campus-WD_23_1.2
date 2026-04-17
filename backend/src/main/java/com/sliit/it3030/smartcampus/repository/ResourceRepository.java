package com.sliit.it3030.smartcampus.repository;

import com.sliit.it3030.smartcampus.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ResourceRepository extends MongoRepository<Resource, String> {

        List<Resource> findByAvailable(boolean available);

        List<Resource> findByTypeIgnoreCase(String type);

        List<Resource> findByNameContainingIgnoreCase(String keyword);

        Optional<Resource> findByNameIgnoreCaseAndLocationIgnoreCase(String name, String location);

        boolean existsByNameIgnoreCaseAndLocationIgnoreCase(String name, String location);
}