package donation.main.exception;


import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(value = HttpStatus.CONFLICT)
public class ServerAlreadyExistsException extends RuntimeException {
    private final String serverName;

    private final long id;

    public ServerAlreadyExistsException(String message, long id) {
        super(String.format("%s  %s", message, id));
        this.id = id;
        this.serverName = null;
    }

    public ServerAlreadyExistsException(String message, String serverName) {
        super(String.format("%s  %s", message, serverName));
        this.serverName = serverName;
        this.id = 0;
    }
}
