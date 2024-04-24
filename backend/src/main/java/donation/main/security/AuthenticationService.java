package donation.main.security;

import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import java.util.Optional;
import donation.main.dto.auth.JwtAuthResponseDto;
import donation.main.dto.auth.LoginRequestDto;
import donation.main.dto.auth.LoginResponseDto;
import donation.main.dto.auth.MfaVerificationRequestDto;
import donation.main.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final JwtUtil jwtUtil;
    private final TfaUtil tfaUtil;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public Optional<LoginResponseDto> login(LoginRequestDto request) throws AuthenticationException {
        Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.username(),
                request.password()
        ));
        UserEntity user = (UserEntity) authenticate.getPrincipal();
        if (!user.isTfaActive()) {
            GoogleAuthenticatorKey authKey = tfaUtil.createAuthKey();
            user.setTfaKey(authKey.getKey());
            System.out.println(user.getTfaKey());
            String base64QRCode = tfaUtil.createBase64QRCode(user.getEmail(), authKey);
            return Optional.of(new LoginResponseDto(base64QRCode));
        }
        return Optional.empty();
    }

    @Transactional
    public JwtAuthResponseDto totpVerification(MfaVerificationRequestDto dto) throws AuthenticationException {
        UserEntity user = (UserEntity) userDetailsService.loadUserByUsername(dto.username());
        tfaUtil.validateCode(dto.code(), user.getTfaKey());
        user.setTfaActive(true);
        return new JwtAuthResponseDto(jwtUtil.generateToken(user));
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
