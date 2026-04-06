package backend.repository;

import backend.model.TicketModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TicketRepository extends MongoRepository<TicketModel, String> {
    List<TicketModel> findByCreatedBy(String createdBy);



}
