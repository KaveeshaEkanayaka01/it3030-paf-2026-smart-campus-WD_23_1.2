package backend.repository;

import backend.model.AttachmentModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<AttachmentModel, Long> {

    // Get attachments by ticket id
    List<AttachmentModel> findByTicketId(Long ticketId);

    long countByTicketId(Long ticketId);

}
