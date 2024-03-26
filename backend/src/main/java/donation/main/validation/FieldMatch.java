package donation.main.validation;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import donation.main.validation.impl.FieldMatchImpl;

@Target({TYPE})
@Retention(RUNTIME)
@Constraint(validatedBy = {FieldMatchImpl.class})
public @interface FieldMatch {
    String message() default "Fields don't match";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String fieldName();

    String fieldMatchName();
}
