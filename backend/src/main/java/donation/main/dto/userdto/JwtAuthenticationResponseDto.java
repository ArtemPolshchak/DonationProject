package donation.main.dto.userdto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Ответ c токеном доступа")
public record JwtAuthenticationResponseDto(
        @Schema(description = "Токен доступа", example = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYyMjUwNj...")
        String token
) {

}
