package backend.dto;

import backend.enums.TicketStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketStatusUpdateRequestDto {

    private TicketStatus status;
    private String actorRole;
    private String resolutionNotes;
    private String rejectionReason;
}
