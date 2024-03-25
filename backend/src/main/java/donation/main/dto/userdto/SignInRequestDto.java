package donation.main.dto.userdto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Запрос на аутентификацию")
public record SignInRequestDto(
        @Schema(description = "Почта пользователя", example = "bobmarley@gmail.com")
        @NotBlank(message = "Почта пользователя не может быть пустыми")
        @Size(min = 5, max = 50, message = "Почта пользователя должна содержать от 5 до 50 символов")
        String email,
        @Schema(description = "Пароль", example = "password")
        @NotBlank(message = "Пароль не может быть пустыми")
        @Size(min = 6, max = 50, message = "Длина пароля должна быть от 8 до 255 символов")
        String password
) {

}
