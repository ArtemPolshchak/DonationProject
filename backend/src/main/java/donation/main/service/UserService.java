package donation.main.service;

import jakarta.persistence.EntityNotFoundException;
import donation.main.dto.userdto.UserResponseDto;
import donation.main.dto.userdto.UserSelfUpdateRequestDto;
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

    public void checkIsExist(String username, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new UserWithDataExistsException("User with the name already exists:", username);
        }
        if (userRepository.existsByEmail(email)) {
            throw new UserWithDataExistsException("User with the email already exists:", email);
        }
    }

    public UserEntity getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    public UserEntity getCurrentUser() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        return getByUsername(username);
    }

    public void setUserRole(Long userId, Role newRole) {
        UserEntity user = getById(userId);
        user.setRole(newRole);
        save(user);
    }

    public void removeUserRole(Long userId) {
        UserEntity user = getById(userId);
        user.setRole(Role.GUEST);
        save(user);
    }

    public Page<UserEntity> findAll(Pageable pageable) {
        return userRepository.findAllBy(pageable);
    }

    public UserEntity getById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(
                "User with the id not found"));
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public UserResponseDto update(Long id, UserSelfUpdateRequestDto dto) {
        userCheck(id);
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Can't find  user by id " + id));
        user = userMapper.update(user, dto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userMapper.toDto(userRepository.save(user));
    }

    private void userCheck(Long id) {
        UserEntity authenticatedUser = (UserEntity) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        if (!authenticatedUser.getId().equals(id)) {
            throw new UnauthorizedActionException("Access denied");
        }
    }
}
