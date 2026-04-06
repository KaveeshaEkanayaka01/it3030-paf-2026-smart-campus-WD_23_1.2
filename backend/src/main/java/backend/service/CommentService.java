package backend.service;

import backend.exception.ResourceNotFoundException;
import backend.model.CommentModel;
import backend.model.TicketModel;
import backend.repository.CommentRepository;
import backend.repository.TicketRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    public CommentModel addComment(String ticketId, CommentModel comment){

        TicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        if (comment.getId() == null || comment.getId().isBlank()) {
            comment.setId(UUID.randomUUID().toString());
        }

        comment.setTicketId(ticket.getId());
        if (comment.getCreatedAt() == null) {
            comment.setCreatedAt(LocalDateTime.now());
        }

        return commentRepository.save(comment);
    }

    public List<CommentModel> getComments(String ticketId){
        return commentRepository.findByTicketId(ticketId);
    }

    public CommentModel updateComment(String id, CommentModel newComment, String actorUserId, String actorRole){

        CommentModel comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!canModify(comment, actorUserId, actorRole)) {
            throw new IllegalArgumentException("You are not allowed to edit this comment");
        }

        comment.setMessage(newComment.getMessage());

        return commentRepository.save(comment);
    }

    public void deleteComment(String id, String actorUserId, String actorRole){
        CommentModel comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!canModify(comment, actorUserId, actorRole)) {
            throw new IllegalArgumentException("You are not allowed to delete this comment");
        }

        commentRepository.deleteById(id);
    }

    private boolean canModify(CommentModel comment, String actorUserId, String actorRole) {
        String owner = safe(comment.getCreatedBy());
        String actor = safe(actorUserId);
        String role = safe(actorRole).toUpperCase(Locale.ROOT);

        return owner.equals(actor) || "STAFF".equals(role) || "ADMIN".equals(role) || "TECHNICIAN".equals(role);
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

}
