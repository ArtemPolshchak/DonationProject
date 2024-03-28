package donation.main.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ServerNotFoundException extends RuntimeException {

    private final long id;

    private final String serverName;

    public ServerNotFoundException(String message, long id) {
        super(String.format("%s  %s", message, id));
        this.id = id;
        this.serverName = null;
    }

    public ServerNotFoundException(String message, String serverName) {
        super(String.format("%s  %s", message, serverName));
        this.serverName = serverName;
        this.id = 0;
    }
}
