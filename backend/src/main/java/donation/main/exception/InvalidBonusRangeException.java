package donation.main.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class InvalidBonusRangeException extends RuntimeException{

    public InvalidBonusRangeException(String message) {
        super(message);
    }
}
