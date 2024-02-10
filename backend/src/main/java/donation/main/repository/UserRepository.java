package donation.main.repository;

import donation.main.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Page<UserEntity> findAllBy(Pageable pageable);

    Optional<UserEntity> findByUsername(String username);

//    @Query("FROM UserEntity e WHERE e.email = :email")
//    Optional<UserEntity> findByEmail(String email);

    @Query("FROM UserEntity e WHERE e.email = :email")
    Optional<UserEntity> findUserEntityByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
