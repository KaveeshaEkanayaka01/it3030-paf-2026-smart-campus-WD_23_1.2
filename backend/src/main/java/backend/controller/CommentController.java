package backend.controller;

import backend.model.CommentModel;
import backend.model.TicketModel;
import backend.repository.CommentRepository;
import backend.repository.TicketRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    // Add Comment
    @PostMapping("/tickets/{ticketId}/comments")
    public CommentModel addComment(@PathVariable Long ticketId,
                                   @RequestBody CommentModel comment) {

        Optional<TicketModel> ticketOptional = ticketRepository.findById(ticketId);

        if(ticketOptional.isPresent()) {
            comment.setTicket(ticketOptional.get());
            return commentRepository.save(comment);
        }

        return null;
    }

    // Get Comments by Ticket
    @GetMapping("/tickets/{ticketId}/comments")
    public List<CommentModel> getComments(@PathVariable Long ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }

    // Update Comment
    @PutMapping("/comments/{id}")
    public CommentModel updateComment(@PathVariable Long id,
                                      @RequestBody CommentModel newComment) {

        Optional<CommentModel> commentOptional = commentRepository.findById(id);

        if(commentOptional.isPresent()) {
            CommentModel comment = commentOptional.get();
            comment.setMessage(newComment.getMessage());
            return commentRepository.save(comment);
        }

        return null;
    }

    // Delete Comment
    @DeleteMapping("/comments/{id}")
    public String deleteComment(@PathVariable Long id) {

        commentRepository.deleteById(id);

        return "Comment deleted";
    }
}