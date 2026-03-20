package backend.controller;

import backend.model.TicketModel;
import backend.model.TicketStatus;
import backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/tickets")
public class TicketController {
    @Autowired
    private TicketRepository ticketRepository;

    //create
    @PostMapping
    public TicketModel createTicket(@RequestBody TicketModel ticket){
        ticket.setStatus(TicketStatus.OPEN);
        return ticketRepository.save(ticket);
    }

    //get user ticket
    @GetMapping("/my")
    public List<TicketModel> getMyTickets(@RequestParam String createdBy){
        return ticketRepository.findByCreatedBy(createdBy);
    }
    //get all ticket
    @GetMapping
    public List<TicketModel> getAllTickets(){
        return ticketRepository.findAll();
    }

    // Assign Technician (Admin)
    @PutMapping("/{id}/assign")
    public TicketModel assignTechnician(@PathVariable Long id, @RequestParam String technician) {

        Optional<TicketModel> ticketOptional = ticketRepository.findById(id);

        if(ticketOptional.isPresent()) {
            TicketModel ticket = ticketOptional.get();
            ticket.setAssignedTechnician(technician);
            return ticketRepository.save(ticket);
        }

        return null;
    }

    // Update Ticket Status (Technician)
    @PutMapping("/{id}/status")
    public TicketModel updateStatus(@PathVariable Long id, @RequestParam TicketStatus status) {

        Optional<TicketModel> ticketOptional = ticketRepository.findById(id);

        if(ticketOptional.isPresent()) {
            TicketModel ticket = ticketOptional.get();
            ticket.setStatus(status);
            return ticketRepository.save(ticket);
        }

        return null;
    }





}
