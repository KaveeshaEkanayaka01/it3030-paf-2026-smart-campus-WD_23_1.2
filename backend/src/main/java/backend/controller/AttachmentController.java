package backend.controller;

import backend.model.AttachmentModel;
import backend.model.TicketModel;
import backend.repository.AttachmentRepository;
import backend.repository.TicketRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin
public class AttachmentController {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/{id}/attachments")
    public String uploadAttachment(@PathVariable Long id,
                                   @RequestParam("file") MultipartFile file) throws IOException {

        Optional<TicketModel> ticketOptional = ticketRepository.findById(id);

        if(ticketOptional.isEmpty()) {
            return "Ticket not found";
        }

        TicketModel ticket = ticketOptional.get();

        String fileName = file.getOriginalFilename();
        String filePath = UPLOAD_DIR + fileName;

        File directory = new File(UPLOAD_DIR);
        if(!directory.exists()) {
            directory.mkdirs();
        }

        file.transferTo(new File(filePath));

        AttachmentModel attachment = new AttachmentModel();
        attachment.setFileName(fileName);
        attachment.setFileType(file.getContentType());
        attachment.setFilePath(filePath);
        attachment.setTicket(ticket);

        attachmentRepository.save(attachment);

        return "File uploaded successfully";
    }
}