package donation.main.exception;

import org.springframework.security.core.AuthenticationException;

public class TotpAuthenticationException extends AuthenticationException {
    public TotpAuthenticationException(String msg) {
        super(msg);
    }
}
