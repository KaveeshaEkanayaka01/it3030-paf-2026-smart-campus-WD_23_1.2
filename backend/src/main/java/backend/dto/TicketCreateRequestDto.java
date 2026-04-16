package backend.dto;

import backend.enums.PriorityLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketCreateRequestDto {

    private String title;
    private String description;
    private String category;
    private String location;
    private String preferredContact;
    private String createdBy;
    private PriorityLevel priority;
}
