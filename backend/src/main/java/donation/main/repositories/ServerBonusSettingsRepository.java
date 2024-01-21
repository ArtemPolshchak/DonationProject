package donation.main.repositories;

import donation.main.entity.ServerBonusSettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServerBonusSettingsRepository extends JpaRepository<ServerBonusSettingsEntity, Long> {
}
