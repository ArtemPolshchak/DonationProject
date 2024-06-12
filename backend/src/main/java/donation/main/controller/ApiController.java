package donation.main.controller;

import donation.main.service.ApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/app")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class ApiController {

    private final ApiService apiService;

    @GetMapping("/balance")
    public Mono<ResponseEntity<String>> getBalance(@RequestParam String email) {
        return apiService.getBalance(email)
                .map(response -> ResponseEntity.ok(response))
                .onErrorResume(error -> {
                    String errorMessage = "Error: " + error.getMessage();
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage));
                });
    }

    @PostMapping("/update-balance")
    public Mono<ResponseEntity<String>> updateBalance(@RequestParam String email, @RequestParam int value) {
        return apiService.updateBalance(email, value)
                .map(response -> ResponseEntity.ok(response))
                .onErrorResume(error -> {
                    String errorMessage = "Error: " + error.getMessage();
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage));
                });
    }
}
