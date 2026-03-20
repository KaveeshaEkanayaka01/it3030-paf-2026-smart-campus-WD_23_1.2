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

import java.io.File;
import java.io.IOException;

@Service
public class AttachmentService {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    private static final String UPLOAD_DIR = "uploads/";

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
        String filePath = UPLOAD_DIR + fileName;

        File directory = new File(UPLOAD_DIR);
        if(!directory.exists()){
            directory.mkdirs();
        }

        file.transferTo(new File(filePath));

        AttachmentModel attachment = new AttachmentModel();
        attachment.setFileName(fileName);
        attachment.setFileType(file.getContentType());
        attachment.setFilePath(filePath);
        attachment.setTicket(ticket);

        return attachmentRepository.save(attachment);
    }
}