package donation.main.security;


import donation.main.dto.userdto.JwtAuthenticationResponseDto;
import donation.main.dto.userdto.SignInRequestDto;
import donation.main.dto.userdto.SignUpRequestDto;
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

    public JwtAuthenticationResponseDto signUp(SignUpRequestDto request) {

        UserEntity user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.password()));
        userService.createUser(user);

        return new JwtAuthenticationResponseDto(jwtService.generateToken(user));
    }

    public JwtAuthenticationResponseDto signIn(SignInRequestDto request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.username(),
                request.password()
        ));

        UserDetails user = userService
                .userDetailsService()
                .loadUserByUsername(request.username());

        return new JwtAuthenticationResponseDto(jwtService.generateToken(user));
    }
}
