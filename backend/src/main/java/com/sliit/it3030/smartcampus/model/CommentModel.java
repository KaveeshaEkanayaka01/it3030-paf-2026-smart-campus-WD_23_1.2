package com.sliit.it3030.smartcampus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "comments")
public class CommentModel {
    @Id
    private String id;
    private String message;
    private String createdBy;
    private LocalDateTime createdAt;

    @Field("ticketId")
    private String ticketId;

    public CommentModel(){

    }

    public CommentModel(String id, String message, String createdBy, LocalDateTime createdAt, String ticketId) {
        this.id = id;
        this.message = message;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.ticketId = ticketId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }
}
