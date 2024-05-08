package donation.main.repository;

import java.util.Optional;
import donation.main.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Page<UserEntity> findAllBy(Pageable pageable);

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Modifying
    @Query(nativeQuery = true,
            value = "UPDATE users SET is_tfa_active = false WHERE id = :id")
    void resetTfaByUserId(Long id);
}
