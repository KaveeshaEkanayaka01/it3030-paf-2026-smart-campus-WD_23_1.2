package backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "attachments")
public class AttachmentModel {
    @Id
    private String id;
    private String fileName;
    private String filePath;
    private String fileType;

    @Field("ticketId")
    private String ticketId;
 

    
}
