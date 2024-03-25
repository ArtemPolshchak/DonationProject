package donation.main.security;


import donation.main.dto.userdto.JwtAuthenticationResponseDto;
import donation.main.dto.userdto.SignInRequestDto;
import donation.main.dto.userdto.SignUpRequestDto;
import donation.main.dto.userdto.UserResponseDto;
import donation.main.entity.UserEntity;
import donation.main.mapper.UserMapper;
import donation.main.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserService userService;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final UserMapper userMapper;

    public UserResponseDto signUp(SignUpRequestDto dto) {
        userService.checkIsExist(dto.username(), dto.email());
        UserEntity user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.password()));
        return userMapper.toDto(userService.save(user));
    }

    public JwtAuthenticationResponseDto signIn(SignInRequestDto request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password()
        ));

        UserDetails user = userService
                .userDetailsService()
                .loadUserByUsername(request.email());

        return new JwtAuthenticationResponseDto(jwtService.generateToken(user));
    }
}
