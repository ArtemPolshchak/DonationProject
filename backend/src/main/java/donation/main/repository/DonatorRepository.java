package donation.main.repository;

import java.util.Optional;
import donation.main.entity.DonatorEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

public interface DonatorRepository extends JpaRepository<DonatorEntity, Long> {

    Optional<DonatorEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<DonatorEntity> findByEmailContainingIgnoreCase(String email, Pageable pageable);
}
