package donation.main.service;

import donation.main.entity.UserEntity;
import donation.main.enumeration.Role;
import donation.main.exception.UserNotFoundException;
import donation.main.exception.UserWithDataExistsException;
import donation.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserEntity save(UserEntity entity) {
        return userRepository.save(entity);
    }

    public UserEntity createUser(UserEntity user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserWithDataExistsException("User with the name already exists:", user.getUsername());
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserWithDataExistsException("User with the email already exists:", user.getEmail());
        }

        return save(user);
    }

    public UserEntity getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    public UserDetailsService userDetailsService() {
        return this::getByUsername;
    }

    public UserEntity getCurrentUser() {
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        return getByUsername(username);
    }

    @Deprecated
    public void getAdmin() {
        var user = getCurrentUser();
        user.setRole(Role.ADMIN);
        save(user);
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

    public Page<UserEntity> findAllByPage(Pageable pageable) {
        return userRepository.findAllBy(pageable);
    }

    public UserEntity getById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(
                "User with the id not found"));
    }

    public void deleteUser(Long id) {
            userRepository.deleteById(id);
    }
}
