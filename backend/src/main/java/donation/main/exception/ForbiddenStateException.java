package donation.main.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class ForbiddenStateException extends RuntimeException {
    public ForbiddenStateException(String message) {
        super(message);
    }
}
