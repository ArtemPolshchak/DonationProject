package donation.main.externaldb.repository;

import donation.main.externaldb.entity.ExternalDonatorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExternalDonatorRepository extends JpaRepository<ExternalDonatorEntity, Long> {
}
