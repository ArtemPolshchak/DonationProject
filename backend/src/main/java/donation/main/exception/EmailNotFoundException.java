package donation.main.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class EmailNotFoundException extends RuntimeException {

    private final String email;

    public EmailNotFoundException(String message, String email) {
        super(String.format("%s  %s", message, email));
        this.email = email;
    }

}
