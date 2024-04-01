package donation.main.exception;

import org.springframework.core.convert.ConversionException;

public class ImageConversionException extends ConversionException {
    public ImageConversionException(String message) {
        super(message);
    }

    public ImageConversionException(String message, Throwable cause) {
        super(message, cause);
    }
}
