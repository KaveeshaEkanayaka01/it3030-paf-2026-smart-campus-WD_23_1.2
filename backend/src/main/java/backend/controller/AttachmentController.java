package backend.controller;

import backend.model.AttachmentModel;
import backend.model.TicketModel;
import backend.repository.AttachmentRepository;
import backend.repository.TicketRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin
public class AttachmentController {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    private static final Path UPLOAD_DIR = Paths.get(System.getProperty("user.dir"), "uploads");

    @PostMapping("/{id}/attachments")
    public String uploadAttachment(@PathVariable Long id,
                                   @RequestParam("file") MultipartFile file) throws IOException {

        Optional<TicketModel> ticketOptional = ticketRepository.findById(id);

        if(ticketOptional.isEmpty()) {
            return "Ticket not found";
        }

        TicketModel ticket = ticketOptional.get();

        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isBlank()) {
            throw new IOException("Invalid file name");
        }

        Files.createDirectories(UPLOAD_DIR);
        Path destination = UPLOAD_DIR.resolve(fileName).normalize();
        file.transferTo(destination);

        String filePath = destination.toString();

        AttachmentModel attachment = new AttachmentModel();
        attachment.setFileName(fileName);
        attachment.setFileType(file.getContentType());
        attachment.setFilePath(filePath);
        attachment.setTicket(ticket);

        attachmentRepository.save(attachment);

        return "File uploaded successfully";
    }

    @GetMapping("/{id}/attachments")
    public List<AttachmentModel> getAttachments(@PathVariable Long id) {
        return attachmentRepository.findByTicketId(id);
    }
}