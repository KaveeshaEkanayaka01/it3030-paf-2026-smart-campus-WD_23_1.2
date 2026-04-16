package backend.dto;

import backend.enums.PriorityLevel;
import backend.enums.TicketStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TicketResponseDto {

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
    private PriorityLevel priority;
    private TicketStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime firstRespondedAt;
    private LocalDateTime resolvedAt;
}
