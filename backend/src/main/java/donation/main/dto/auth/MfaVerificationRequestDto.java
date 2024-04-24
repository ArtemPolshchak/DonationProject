package donation.main.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.lang.NonNull;

public record MfaVerificationRequestDto(
        @NotBlank
        String username,
        @NonNull
        @Size(min = 6, max = 6)
        String code
) {
}
