package donation.main.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class AccessForbiddenException extends AccessDeniedException {

    public AccessForbiddenException(String message) {
        super(message);
    }
}
