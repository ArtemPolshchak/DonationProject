package donation.main.service;

import donation.main.entity.UserEntity;
import donation.main.enumeration.Role;
import donation.main.mapper.UserMapper;
import donation.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserEntity save(UserEntity entity) {
        return userRepository.save(entity);
    }

    public UserEntity createUser(UserEntity user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new NoSuchElementException("Пользователь с таким именем уже существует");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new NoSuchElementException("Пользователь с таким email уже существует");
        }

        return save(user);
    }

    public UserEntity getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("Пользователь не найден"));
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

    public Iterable<UserEntity> readAll() {
        return userRepository.findAll();
    }

    public UserEntity getById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    public void deleteUser(Long id) {
            userRepository.deleteById(id);
    }
}
