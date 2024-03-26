package donation.main.dto.userdto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import donation.main.validation.FieldMatch;

@FieldMatch(fieldName = "password", fieldMatchName = "repeatedPassword")
public record UserSelfUpdateRequestDto(
        @Email
        String email,
        @Size(min = 5, max = 50)
        String password,
        String repeatedPassword
) {
}
