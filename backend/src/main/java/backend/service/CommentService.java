package backend.service;

import backend.exception.ResourceNotFoundException;
import backend.model.CommentModel;
import backend.model.TicketModel;
import backend.repository.CommentRepository;
import backend.repository.TicketRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    public CommentModel addComment(Long ticketId, CommentModel comment){

        TicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        comment.setTicket(ticket);

        return commentRepository.save(comment);
    }

    public List<CommentModel> getComments(Long ticketId){
        return commentRepository.findByTicketId(ticketId);
    }

    public CommentModel updateComment(Long id, CommentModel newComment){

        CommentModel comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        comment.setMessage(newComment.getMessage());

        return commentRepository.save(comment);
    }

    public void deleteComment(Long id){
        commentRepository.deleteById(id);
    }

}
