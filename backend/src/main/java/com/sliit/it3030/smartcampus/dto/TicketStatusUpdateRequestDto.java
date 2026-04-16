package com.sliit.it3030.smartcampus.dto;

import com.sliit.it3030.smartcampus.model.TicketStatus;

public class TicketStatusUpdateRequestDto {

    private TicketStatus status;
    private String actorRole;
    private String resolutionNotes;
    private String rejectionReason;

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getActorRole() {
        return actorRole;
    }

    public void setActorRole(String actorRole) {
        this.actorRole = actorRole;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
