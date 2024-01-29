package donation.main.externaldb.repository;

import donation.main.externaldb.entity.ExternalDonatorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExternalDonatorRepository extends JpaRepository<ExternalDonatorEntity, Long> {
    Optional<ExternalDonatorEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
