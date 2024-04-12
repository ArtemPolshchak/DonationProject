package donation.main.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.HashMap;
import java.util.Map;
import donation.main.exception.AccessForbiddenException;
import donation.main.exception.EmailNotFoundException;
import donation.main.exception.ErrorResponse;
import donation.main.exception.InvalidBonusRangeException;
import donation.main.exception.InvalidTransactionState;
import donation.main.exception.PageNotFoundException;
import donation.main.exception.ServerAlreadyExistsException;
import donation.main.exception.ServerNotFoundException;
import donation.main.exception.TransactionBadRequestException;
import donation.main.exception.TransactionNotFoundException;
import donation.main.exception.UnauthorizedActionException;
import donation.main.exception.UserNotFoundException;
import donation.main.exception.UserWithDataExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandlingControllerAdvice {

    private static final String MESSAGE = "message";

    @ResponseBody
    @ExceptionHandler(TransactionBadRequestException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    Map<String, String> forbiddenHandler(TransactionBadRequestException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((ObjectError error) -> {
            if (error instanceof FieldError fieldError) {
                String fieldName = fieldError.getField();
                String errorMessage = error.getDefaultMessage();
                errors.put(fieldName, errorMessage);
            } else {
                errors.put(error.getObjectName(), error.getDefaultMessage());
            }
        });
        return ResponseEntity.of(getProblemDetail(HttpStatus.BAD_REQUEST, errors)).build();
    }

    @ExceptionHandler(ErrorResponse.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    @ResponseBody
    Map<String, String> handleCustomException(ErrorResponse ex) {
        return Map.of(MESSAGE, ex.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(TransactionNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    Map<String, String> notFoundHandler(TransactionNotFoundException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    Map<String, String> userNotFoundHandler(UserNotFoundException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(UnauthorizedActionException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    Map<String, String> handleUnauthorizedActionException(UnauthorizedActionException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(EmailNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    Map<String, String> handleEmailNotFoundException(EmailNotFoundException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(UserWithDataExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    Map<String, String> handleUserWithDataExistsException(UserWithDataExistsException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String, String> handleAccessDeniedException(org.springframework.security.access.AccessDeniedException ex) {
        return Map.of(MESSAGE, "Доступ заборонено");
    }

    @ResponseBody
    @ExceptionHandler(
            {InvalidTransactionState.class,
                    PageNotFoundException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    Map<String, String> handleUserWithDataExistsException(RuntimeException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(AccessForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    Map<String, String> handleUserWithDataExistsException(AccessForbiddenException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(InvalidBonusRangeException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    Map<String, String> handleUserWithDataExistsException(InvalidBonusRangeException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(ServerAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    Map<String, String> handleUserWithDataExistsException(ServerAlreadyExistsException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(ServerNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    Map<String, String> handleServerNotFoundException(ServerNotFoundException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler({RuntimeException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    Map<String, String> handleRuntimeException(RuntimeException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    private ProblemDetail getProblemDetail(HttpStatus status, Map<String, String> errors) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, errors.toString());
        problemDetail.setProperty("timestamp", LocalDateTime.now());
        return problemDetail;
    }
}
