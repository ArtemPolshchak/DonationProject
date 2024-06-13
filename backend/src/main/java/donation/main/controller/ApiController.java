package donation.main.controller;

import donation.main.service.ApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api.mmoweb.biz/v1/Control")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class ApiController {

    private final ApiService apiService;

    @GetMapping("/users/balance")
    public Mono<ResponseEntity<String>> getBalance(@RequestParam String email,
                                                    @RequestParam(required = false) Integer serverId) {
        return apiService.getBalance(email, serverId != null ? serverId : 0)
                .map(balance -> ResponseEntity.ok(balance))
                .onErrorResume(error -> {
                    String errorMessage = "Error: " + error.getMessage();
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage));
                });
    }

    @GetMapping("/users/get")
    public Mono<ResponseEntity<String>> getUser(@RequestParam String email) {
        return apiService.getDonator(email)
                .map(response -> ResponseEntity.ok(response))
                .onErrorResume(error -> {
                    String errorMessage = "Error: " + error.getMessage();
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage));
                });
    }

    @PostMapping("/users/update-balance")
    public Mono<ResponseEntity<String>> updateBalance(@RequestParam String email, @RequestParam int value) {
        return apiService.updateBalance(email, value)
                .map(response -> ResponseEntity.ok(response))
                .onErrorResume(error -> {
                    String errorMessage = "Error: " + error.getMessage();
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage));
                });
    }
}
