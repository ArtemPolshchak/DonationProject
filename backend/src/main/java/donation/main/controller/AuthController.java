package donation.main.controller;

import donation.main.dto.userdto.JwtAuthenticationResponseDto;
import donation.main.dto.userdto.SignInRequestDto;
import donation.main.dto.userdto.UserCreateRequestDto;
import donation.main.dto.userdto.UserResponseDto;
import donation.main.security.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @Operation(summary = "Registration new user")
    @PostMapping("/sign-up")
    public ResponseEntity<UserResponseDto> signUp(@RequestBody @Valid UserCreateRequestDto request) {
        return ResponseEntity.ok(authenticationService.signUp(request));
    }

    @Operation(summary = "Authorisation user")
    @PostMapping("/sign-in")
    public JwtAuthenticationResponseDto signIn(@RequestBody @Valid SignInRequestDto request) {
        return authenticationService.signIn(request);
    }

    @GetMapping("/error")
    public String errorMessage() {
        return "You are not authorized to access this resource.";
    }
}
