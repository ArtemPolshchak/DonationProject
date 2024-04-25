package donation.main.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public class ApplicationException extends RuntimeException {
    private final HttpStatus status;
    private final String message;

    public ApplicationException(HttpStatus status) {
        this.status = status;
        this.message = "";
    }
}
