package donation.main.dto.userdto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Запрос на аутентификацию")
public record SignInRequestDto(
        @Schema(description = "Имя пользователя", example = "Jon")
        @NotBlank(message = "Имя пользователя не может быть пустыми")
        @Size(min = 5, max = 50, message = "Имя пользователя должно содержать от 5 до 50 символов")
        String username,
        @Schema(description = "Пароль", example = "my_1secret1_password")
        @NotBlank(message = "Пароль не может быть пустыми")
        @Size(min = 8, max = 255, message = "Длина пароля должна быть от 8 до 255 символов")
        String password
) {

}
