package donation.main.dto.user;

import donation.main.enumeration.Role;
import donation.main.validation.FieldMatch;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Запрос на регистрацию")
@FieldMatch(fieldName = "password", fieldMatchName = "repeatedPassword", message = "Passwords don't match")
public record UserCreateRequestDto(
        @Schema(description = "Имя пользователя", example = "Jonny")
        @NotBlank(message = "Имя пользователя не может быть пустыми")
        @Size(min = 5, max = 50, message = "Имя пользователя должно содержать от 5 до 50 символов")
        String username,

        @Schema(description = "Адрес электронной почты", example = "jondoe@gmail.com")
        @Size(min = 5, max = 50, message = "Адрес электронной почты должен содержать от 5 до 255 символов")
        @Email(message = "Email адрес должен быть в формате user@example.com")
        String email,

        @Schema(description = "Пароль", example = "my_1secret1_password")
        @Size(min = 5, max = 50)
        String password,
        String repeatedPassword,

        @NotNull
        Role role
) {
}