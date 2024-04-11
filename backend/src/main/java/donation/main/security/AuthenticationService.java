package donation.main.security;


import java.util.Optional;
import donation.main.dto.userdto.UserCreateRequestDto;
import donation.main.dto.userdto.JwtAuthenticationResponseDto;
import donation.main.dto.userdto.SignInRequestDto;
import donation.main.dto.userdto.UserResponseDto;
import donation.main.entity.UserEntity;
import donation.main.mapper.UserMapper;
import donation.main.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserService userService;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    private final UserMapper userMapper;

    public UserResponseDto signUp(UserCreateRequestDto dto) {
        userService.checkIsExist(dto.username(), dto.email());
        UserEntity user = userMapper.toEntity(dto);
        return userMapper.toDto(userService.save(user));
    }

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
