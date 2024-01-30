package donation.main.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class AccessForbiddenException extends RuntimeException {
    private final String role;

    public AccessForbiddenException(String message, String role) {
        super(String.format("%s  %s", message, role));
        this.role = role;
    }
}
