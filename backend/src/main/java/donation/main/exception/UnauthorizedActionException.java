package donation.main.exception;

import org.springframework.security.core.AuthenticationException;

public class UnauthorizedActionException extends AuthenticationException {
    public UnauthorizedActionException(String message) {
        super(message);
    }
}