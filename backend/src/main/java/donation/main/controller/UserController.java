package donation.main.controller;

import jakarta.validation.Valid;
import donation.main.dto.user.UserCreateRequestDto;
import donation.main.dto.user.UserResponseDto;
import donation.main.dto.user.UserUpdateRequestDto;
import donation.main.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Registration new user")
    @PostMapping()
    public ResponseEntity<UserResponseDto> create(@RequestBody @Valid UserCreateRequestDto request) {
        return ResponseEntity.ok(userService.create(request));
    }

    @Operation(summary = "get all users")
    @GetMapping()
    public ResponseEntity<Page<UserResponseDto>> getAllUsers(Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.findAll(pageable));
    }

    @Operation(summary = "get user by Id")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getById(@PathVariable Long id) {

        return ResponseEntity.status(HttpStatus.OK).body(userService.getById(id));
    }

    @Operation(summary = "update user by id")
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponseDto> update(
            @PathVariable Long id,
            @RequestBody @Valid UserUpdateRequestDto dto) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.update(id, dto));
    }

    @PatchMapping("/{id}/tfa")
    public void resetTfa(@PathVariable Long id) {
        userService.resetTfaByUserId(id);
    }

    @Operation(summary = "soft delete user by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
