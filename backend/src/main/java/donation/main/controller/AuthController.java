package donation.main.controller;

import jakarta.validation.Valid;
import donation.main.dto.auth.MfaVerificationRequestDto;
import donation.main.dto.auth.LoginRequestDto;
import donation.main.security.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @Operation(summary = "Authorisation user")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDto request) throws AuthenticationException {
        return authenticationService.login(request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok().build());
    }

    @PostMapping("/totp")
    public ResponseEntity<?> verifyTotp(@Valid @RequestBody MfaVerificationRequestDto request) {
        return ResponseEntity.ok(authenticationService.totpVerification(request));
    }

    @GetMapping("/error")
    public String errorMessage() {
        return "You are not authorized to access this resource.";
    }
}
