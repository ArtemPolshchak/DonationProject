package donation.main.service;

import donation.main.dto.userdto.SignUpRequestDto;
import donation.main.entity.UserEntity;
import donation.main.mapper.UserMapper;
import donation.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserEntity save(UserEntity entity) {
        return userRepository.save(entity);
    }

    public UserEntity createUser(SignUpRequestDto user) {
        if(userRepository.existsByUsername(user.username())) {
            throw new NoSuchElementException("Пользователь с таким именем уже существует");
        }

        if(userRepository.existsByEmail(user.email())) {
            throw new NoSuchElementException("Пользователь с таким email уже существует");
        }

        return userRepository.save(userMapper.toEntity(user));
    }

    public UserEntity getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("Пользователь не найден"));
    }


//    public UserDetailsService userDetailsService() {
//        return this::getByUsername;
//    }

//    public User getCurrentUser() {
//        var username = SecurityContextHolder.getContext().getAuthentication().getName();
//        return getByUsername(username);
//    }

//    /**
//     * Выдача прав администратора текущему пользователю
//     * <p>
//     * Нужен для демонстрации
//     */
//    @Deprecated
//    public void getAdmin() {
//        var user = getCurrentUser();
//        user.setRole(Role.ROLE_ADMIN);
//        save(user);
//    }


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
