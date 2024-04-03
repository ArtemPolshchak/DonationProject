package donation.main.repository;

import java.util.Optional;
import donation.main.entity.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {

    Optional<ImageEntity> findByTransactionId(Long id);
}
