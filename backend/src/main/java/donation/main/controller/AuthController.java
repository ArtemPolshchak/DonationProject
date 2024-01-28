package donation.main.controller;

import donation.main.dto.userdto.JwtAuthenticationResponseDto;
import donation.main.dto.userdto.SignInRequestDto;
import donation.main.dto.userdto.SignUpRequestDto;
import donation.main.security.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
        @PostMapping("/register")
        public JwtAuthenticationResponseDto signUp(@RequestBody @Valid SignUpRequestDto request) {
            return authenticationService.signUp(request);
        }

        @Operation(summary = "Authorisation user")
        @PostMapping("/auth")
        public JwtAuthenticationResponseDto signIn(@RequestBody @Valid SignInRequestDto request) {
            return authenticationService.signIn(request);
        }
    }
