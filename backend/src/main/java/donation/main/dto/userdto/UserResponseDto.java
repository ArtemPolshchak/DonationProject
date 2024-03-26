package donation.main.dto.userdto;

import donation.main.enumeration.Role;

public record UserResponseDto(
        Long id,
        String username,
        String email,
        Role role
) {
}
