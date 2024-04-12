package donation.main.security;

import java.util.Optional;
import donation.main.dto.userdto.JwtAuthenticationResponseDto;
import donation.main.dto.userdto.SignInRequestDto;
import donation.main.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public JwtAuthenticationResponseDto signIn(SignInRequestDto request) {
        Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password()
        ));
        return new JwtAuthenticationResponseDto(jwtService.generateToken((UserEntity) authenticate.getPrincipal()));
    }

    public Optional<UserEntity> getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserEntity user)) {
            return Optional.empty();
        }
        return Optional.of(user);
    }

    public boolean hasAdminPermission() {
        return getAuthenticatedUser()
                .map(authenticatedUser -> authenticatedUser.getAuthorities().stream()
                        .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ADMIN")))
                .orElse(false);
    }
}
