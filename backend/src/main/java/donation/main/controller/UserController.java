package donation.main.controller;

import donation.main.dto.userdto.CreateUserDto;
import donation.main.entity.UserEntity;
import donation.main.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @GetMapping("/")
    public ResponseEntity<Iterable<UserEntity>> getAllPersons() {
        return ResponseEntity.status(HttpStatus.OK).body(service.readAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<UserEntity> createPerson(@RequestBody CreateUserDto userDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createUser(userDto));
    }
}
