package donation.main.repository;

import donation.main.dto.serverbonusdto.ServerBonusDto;
import donation.main.entity.ServerBonusSettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Set;

public interface ServerBonusSettingsRepository extends JpaRepository<ServerBonusSettingsEntity, Long> {

    @Query("SELECT new donation.main.dto.serverbonusdto.ServerBonusDto("
            + "s.fromAmount as fromAmount, "
            + "s.toAmount as toAmount, "
            + "s.bonusPercentage as bonusPercentage) FROM ServerBonusSettingsEntity s WHERE s.server.id = :id ")
    Set<ServerBonusDto> getServerBonusesFromServerByServerId(Long id);

}
