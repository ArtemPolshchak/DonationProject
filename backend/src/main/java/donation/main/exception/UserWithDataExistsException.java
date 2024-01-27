package donation.main.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(value = HttpStatus.CONFLICT)
public class UserWithDataExistsException extends RuntimeException {

    private final String user;

    public UserWithDataExistsException(String message, String user) {
        super(String.format("%s  %s", message, user));
        this.user = user;
    }
}

