package donation.main.exception;

public class TfaQrCodeGenerationException extends RuntimeException {
    public TfaQrCodeGenerationException(String message, Throwable cause) {
        super(message, cause);
    }
}
