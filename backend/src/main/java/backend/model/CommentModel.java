package backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

@Document(collection = "comments")
public class CommentModel {
    @Id
    private String id;
    private String message;
    private String createdBy;
    private LocalDateTime createdAt;

    @Field("ticketId")
    private String ticketId;

    
}
