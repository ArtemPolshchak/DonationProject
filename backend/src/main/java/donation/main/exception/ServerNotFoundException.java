package donation.main.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ServerNotFoundException extends RuntimeException {

        private final long id;

        public ServerNotFoundException(String message, long id) {
            super(String.format("%s  %s", message, id));
            this.id = id;
        }

}
