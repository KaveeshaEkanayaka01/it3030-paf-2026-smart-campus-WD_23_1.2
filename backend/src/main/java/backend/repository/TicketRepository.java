package backend.repository;

import backend.model.TicketModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<TicketModel, Long> {
    List<TicketModel> findByCreatedBy(String createdBy);



}
