package donation.main.service;

import donation.main.dto.user.UserCreateRequestDto;
import donation.main.dto.user.UserResponseDto;
import donation.main.dto.user.UserUpdateRequestDto;
import donation.main.entity.UserEntity;
import donation.main.exception.UnauthorizedActionException;
import donation.main.exception.UserNotFoundException;
import donation.main.exception.UserWithDataExistsException;
import donation.main.mapper.UserMapper;
import donation.main.repository.UserRepository;
import donation.main.security.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDto create(UserCreateRequestDto dto) {
        isExistByLogin(dto.username(), dto.email());
        UserEntity user = userMapper.toEntity(dto);
        return userMapper.toDto(save(user));
    }

    public UserEntity save(UserEntity entity) {
        entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        return userRepository.save(entity);
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
        UserEntity user = findById(id);
        user = userMapper.update(user, dto);
        if (dto.password() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userMapper.toDto(user);
    }

    public UserEntity findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(
                "User with the id not found"));
    }

    @Transactional
    public void resetTfaByUserId(Long id) {
        userRepository.resetTfaByUserId(id);
    }

    private void isExistByLogin(String username, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new UserWithDataExistsException("User with the name already exists:", username);
        }
        if (userRepository.existsByEmail(email)) {
            throw new UserWithDataExistsException("User with the email already exists:", email);
        }
    }
}
