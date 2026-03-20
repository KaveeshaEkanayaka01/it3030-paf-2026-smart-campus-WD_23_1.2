package backend.service;

import backend.exception.AttachmentLimitException;
import backend.exception.FileUploadException;
import backend.exception.ResourceNotFoundException;
import backend.model.AttachmentModel;
import backend.model.TicketModel;
import backend.repository.AttachmentRepository;
import backend.repository.TicketRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class AttachmentService {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    private static final Path UPLOAD_DIR = Paths.get(System.getProperty("user.dir"), "uploads");

    public AttachmentModel uploadAttachment(Long ticketId, MultipartFile file) throws IOException {

        TicketModel ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        if(file.isEmpty()){
            throw new FileUploadException("File is empty");
        }

        if(ticket.getAttachments() != null && ticket.getAttachments().size() >= 3){
            throw new AttachmentLimitException("Maximum 3 attachments allowed");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isBlank()) {
            throw new FileUploadException("Invalid file name");
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

        return attachmentRepository.save(attachment);
    }
}