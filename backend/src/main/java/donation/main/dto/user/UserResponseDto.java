package donation.main.dto.user;

import donation.main.enumeration.Role;

public record UserResponseDto(
        Long id,
        String username,
        String email,
        Role role,
        boolean isTfaActive) {
}
