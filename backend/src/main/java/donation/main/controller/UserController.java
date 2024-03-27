package donation.main.controller;

import jakarta.validation.Valid;
import donation.main.dto.userdto.UserResponseDto;
import donation.main.dto.userdto.UserSelfUpdateRequestDto;
import donation.main.entity.UserEntity;
import donation.main.enumeration.Role;
import donation.main.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "get all users")
    @GetMapping()
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Iterable<UserEntity>> getAllUsers(Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.findAll(pageable));
    }

    @Operation(summary = "get user by Id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserEntity> getById(@PathVariable Long id) {

        return ResponseEntity.status(HttpStatus.OK).body(userService.getById(id));
    }

    @Operation(summary = "change role for user")
    @PutMapping("/{id}/setRole")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> setUserRole(@PathVariable Long id, @RequestParam Role newRole) {
        userService.setUserRole(id, newRole);
        return ResponseEntity.status(HttpStatus.OK).body("Роль користувача оновлено");
    }

    @Operation(summary = "delete role and setup it on GUEST")
    @PutMapping("/{id}/removeRole")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> removeUserRole(@PathVariable Long id) {
        userService.removeUserRole(id);
        return ResponseEntity.status(HttpStatus.OK).body("Роль користувача видалено");
    }

    @Operation(summary = "Update user")
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponseDto> update(
            @PathVariable Long id,
            @RequestBody @Valid UserSelfUpdateRequestDto dto) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.update(id, dto));
    }
}
