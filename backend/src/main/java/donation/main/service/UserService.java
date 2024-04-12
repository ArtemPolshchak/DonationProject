package donation.main.service;

import donation.main.dto.userdto.UserResponseDto;
import donation.main.dto.userdto.UserUpdateRequestDto;
import donation.main.entity.UserEntity;
import donation.main.enumeration.Role;
import donation.main.exception.UnauthorizedActionException;
import donation.main.exception.UserNotFoundException;
import donation.main.exception.UserWithDataExistsException;
import donation.main.mapper.UserMapper;
import donation.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserEntity save(UserEntity entity) {
        entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        return userRepository.save(entity);
    }

    public UserEntity getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    public Page<UserResponseDto> findAll(Pageable pageable) {
        return userRepository.findAllBy(pageable).map(userMapper::toDto);
    }

    public UserResponseDto getById(Long id) {
        return userMapper.toDto(this.findById(id));
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public UserResponseDto update(Long id, UserUpdateRequestDto dto) {
        if (!isAdmin()) {
            throw new UnauthorizedActionException("Access denied");
        }
        UserEntity user = findById(id);
        user = userMapper.update(user, dto);
        if (dto.password() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userMapper.toDto(user);
    }

    public void checkIsExist(String username, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new UserWithDataExistsException("User with the name already exists:", username);
        }
        if (userRepository.existsByEmail(email)) {
            throw new UserWithDataExistsException("User with the email already exists:", email);
        }
    }

    public UserEntity getCurrentUser() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        return getByUsername(username);
    }

    private boolean isAdmin() {
        return getCurrentUser().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Role.ADMIN.name()));
    }

    public UserEntity findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(
                "User with the id not found"));
    }
}
