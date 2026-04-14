package backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Document(collection = "tickets")
public class TicketModel {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;

    private String location;
    private String preferredContact;
    private String createdBy;
    private String assignedTechnician;
    private String resolutionNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime firstRespondedAt;
    private LocalDateTime resolvedAt;

    private  PriorityLevel priority;

    private TicketStatus status;

     

    

    
}
