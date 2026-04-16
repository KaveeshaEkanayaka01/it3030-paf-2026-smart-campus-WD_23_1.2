package com.sliit.it3030.smartcampus.repository;

import com.sliit.it3030.smartcampus.model.CommentModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<CommentModel, String> {

    // Get comments for a specific ticket
    List<CommentModel> findByTicketId(String ticketId);

}