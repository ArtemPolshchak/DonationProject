package donation.main.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import donation.main.enumeration.Role;
import donation.main.validation.FieldMatch;
import org.springframework.boot.context.properties.bind.DefaultValue;

@FieldMatch(fieldName = "password", fieldMatchName = "repeatedPassword", message = "Passwords don't match")
public record UserUpdateRequestDto(
        @Size(min = 5, max = 50)
        String username,
        @Email
        String email,
        @Size(min = 5, max = 50)
        String password,
        String repeatedPassword,
        Role role
) {
}
