package donation.main.exception;

import donation.main.enumeration.TransactionState;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class InvalidTransactionState extends RuntimeException {
    private final TransactionState state;

    public InvalidTransactionState(String message, TransactionState state) {
        super(String.format("%s  %s", message, state));
        this.state = state;
    }
}

