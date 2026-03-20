package backend.service;

import backend.exception.ResourceNotFoundException;
import backend.model.TicketModel;
import backend.model.TicketStatus;
import backend.repository.TicketRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Override
    public TicketModel createTicket(TicketModel ticket) {
        ticket.setStatus(TicketStatus.OPEN);
        return ticketRepository.save(ticket);
    }

    @Override
    public List<TicketModel> getMyTickets(String createdBy) {
        return ticketRepository.findByCreatedBy(createdBy);
    }

    @Override
    public List<TicketModel> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public TicketModel assignTechnician(Long id, String technician) {

        TicketModel ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        ticket.setAssignedTechnician(technician);

        return ticketRepository.save(ticket);
    }

    @Override
    public TicketModel updateStatus(Long id, TicketStatus status) {

        TicketModel ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        ticket.setStatus(status);

        return ticketRepository.save(ticket);
    }
}