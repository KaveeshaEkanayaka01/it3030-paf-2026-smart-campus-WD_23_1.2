package com.sliit.it3030.smartcampus.controller;

import com.sliit.it3030.smartcampus.model.CommentModel;
import com.sliit.it3030.smartcampus.service.CommentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Add Comment
    @PostMapping("/tickets/{ticketId}/comments")
    public CommentModel addComment(@PathVariable String ticketId,
                                   @RequestBody CommentModel comment) {
        return commentService.addComment(ticketId, comment);
    }

    // Get Comments by Ticket
    @GetMapping("/tickets/{ticketId}/comments")
    public List<CommentModel> getComments(@PathVariable String ticketId) {
        return commentService.getComments(ticketId);
    }

    // Update Comment
    @PutMapping("/comments/{id}")
    public CommentModel updateComment(@PathVariable String id,
                                      @RequestBody CommentModel newComment,
                                      @RequestParam String actorUserId,
                                      @RequestParam(defaultValue = "USER") String actorRole) {
        try {
            return commentService.updateComment(id, newComment, actorUserId, actorRole);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, ex.getMessage());
        }
    }

    // Delete Comment
    @DeleteMapping("/comments/{id}")
    public String deleteComment(@PathVariable String id,
                                @RequestParam String actorUserId,
                                @RequestParam(defaultValue = "USER") String actorRole) {
        try {
            commentService.deleteComment(id, actorUserId, actorRole);
            return "Comment deleted";
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, ex.getMessage());
        }
    }
}