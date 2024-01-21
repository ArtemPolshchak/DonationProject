package donation.main.services;

import donation.main.dto.userdto.CreateUserDto;
import donation.main.entity.UserEntity;
import donation.main.mapper.CreateUserMapper;
import donation.main.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CreateUserMapper createUserMapper;

    public UserEntity createUser(CreateUserDto createUserDto) {
        return userRepository.save(createUserMapper.toEntity(createUserDto));
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
