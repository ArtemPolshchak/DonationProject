package donation.main.repository;

import donation.main.entity.DonatorEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DonatorRepository extends JpaRepository<DonatorEntity, Long> {

    Optional<DonatorEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<DonatorEntity> findByEmailContainingIgnoreCase(String email, Pageable pageable);
}
