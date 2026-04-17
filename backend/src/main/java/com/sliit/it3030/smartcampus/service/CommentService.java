package com.sliit.it3030.smartcampus.service;

import com.sliit.it3030.smartcampus.dto.comment.CommentRequest;
import com.sliit.it3030.smartcampus.dto.comment.CommentResponse;
import com.sliit.it3030.smartcampus.exception.ResourceNotFoundException;
import com.sliit.it3030.smartcampus.exception.UnauthorizedException;
import com.sliit.it3030.smartcampus.model.Comment;
import com.sliit.it3030.smartcampus.model.User;
import com.sliit.it3030.smartcampus.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    // Add comment to ticket
    public CommentResponse addComment(String ticketId, CommentRequest request, User currentUser) {
        Comment comment = Comment.builder()
                .ticketId(ticketId)
                .authorId(currentUser.getId())
                .authorName(currentUser.getName())
                .authorAvatar(currentUser.getAvatarUrl())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        Comment saved = commentRepository.save(comment);
        log.info("Comment added to ticket {} by user {}", ticketId, currentUser.getId());

        // Trigger notification for new comment
        notificationService.sendNewCommentNotification(ticketId, currentUser.getName());

        return mapToResponse(saved, currentUser.getId());
    }

    // Get all comments for a ticket
    public List<CommentResponse> getCommentsByTicket(String ticketId, String currentUserId) {
        return commentRepository
                .findByTicketIdAndDeletedFalseOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(comment -> mapToResponse(comment, currentUserId))
                .collect(Collectors.toList());
    }

    // Edit comment (only owner can edit)
    public CommentResponse updateComment(
            String commentId, CommentRequest request, User currentUser) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        // Ownership check
        if (!comment.getAuthorId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setContent(request.getContent());
        comment.setEdited(true);
        comment.setUpdatedAt(LocalDateTime.now());

        Comment updated = commentRepository.save(comment);
        log.info("Comment {} updated by user {}", commentId, currentUser.getId());

        return mapToResponse(updated, currentUser.getId());
    }

    // Delete comment
    // ADMIN can delete any, USER can only delete own
    public void deleteComment(String commentId, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        boolean isAdmin = currentUser.getRoles().contains(User.ROLE_ADMIN);
        boolean isOwner = comment.getAuthorId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("You cannot delete this comment");
        }

        // Soft delete
        comment.setDeleted(true);
        comment.setUpdatedAt(LocalDateTime.now());
        commentRepository.save(comment);

        log.info("Comment {} soft-deleted by user {}", commentId, currentUser.getId());
    }

    // Map Comment entity to CommentResponse DTO
    private CommentResponse mapToResponse(Comment comment, String currentUserId) {
        return CommentResponse.builder()
                .id(comment.getId())
                .ticketId(comment.getTicketId())
                .authorId(comment.getAuthorId())
                .authorName(comment.getAuthorName())
                .authorAvatar(comment.getAuthorAvatar())
                .content(comment.getContent())
                .edited(comment.isEdited())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .isOwner(comment.getAuthorId().equals(currentUserId))
                .build();
    }
}
