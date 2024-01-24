package donation.main.service;

import donation.main.dto.userdto.CreateUserDto;
import donation.main.entity.UserEntity;
import donation.main.mapper.UserMapper;
import donation.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserEntity createUser(CreateUserDto createUserDto) {
        return userRepository.save(userMapper.toEntity(createUserDto));
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
