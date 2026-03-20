package backend.exception;

public class AttachmentLimitException extends RuntimeException{
    public AttachmentLimitException(String message) {
        super(message);
    }
}
