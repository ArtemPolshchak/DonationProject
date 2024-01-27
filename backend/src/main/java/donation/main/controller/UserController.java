package donation.main.controller;

import donation.main.entity.UserEntity;
import donation.main.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @Operation(summary = "get all users")
    @GetMapping("/")
    public ResponseEntity<Iterable<UserEntity>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.OK).body(service.readAll());
    }

    @Operation(summary = "get user by Id")
    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(service.getById(id));
    }
}
