package backend.repository;

import backend.model.CommentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<CommentModel, Long> {

    // Get comments for a specific ticket
    List<CommentModel> findByTicketId(Long ticketId);

}