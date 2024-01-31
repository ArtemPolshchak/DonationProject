package donation.main.repository;

import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.entity.TransactionEntity;
import donation.main.enumeration.TransactionState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServerBonusSettingsRepository extends JpaRepository<ServerBonusSettingsEntity, Long> {
    Page<ServerBonusSettingsEntity> findAllBy(Pageable pageable);
}
