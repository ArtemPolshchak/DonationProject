package donation.main.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Запрос на аутентификацию")
public record LoginRequestDto(
        @Schema(description = "Имя пользователя или почта", example = "bobmarley@gmail.com/ bob777")
        @NotBlank(message = "Имя/Почта пользователя не может быть пустыми")
        @Size(min = 5, max = 50, message = "Имя/Почта пользователя должно содержать от 5 до 50 символов")
        String username,
        @Schema(description = "Пароль", example = "password")
        @NotBlank(message = "Пароль не может быть пустыми")
        @Size(min = 6, max = 50, message = "Длина пароля должна быть от 8 до 255 символов")
        String password
) {

}
