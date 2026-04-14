package com.sliit.it3030.smartcampus.repository;

import com.sliit.it3030.smartcampus.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {

        List<Resource> findByAvailable(boolean available);

        List<Resource> findByTypeIgnoreCase(String type);

        List<Resource> findByNameContainingIgnoreCase(String keyword);
}