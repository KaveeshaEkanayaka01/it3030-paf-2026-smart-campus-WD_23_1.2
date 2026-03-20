package backend.service;

import backend.model.TicketModel;
import backend.model.TicketStatus;

import java.util.List;

public interface TicketService {

    TicketModel createTicket(TicketModel ticket);

    List<TicketModel> getMyTickets(String createdBy);

    List<TicketModel> getAllTickets();

    TicketModel assignTechnician(Long id, String technician);

    TicketModel updateStatus(Long id, TicketStatus status);

}
