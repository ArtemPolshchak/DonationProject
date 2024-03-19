package donation.main.repository;

import java.math.BigDecimal;
import java.util.Map;
import donation.main.dto.donatorsdto.DonatorBonusDto;
import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.DonatorEntity;
import donation.main.entity.ServerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ServerRepository extends JpaRepository<ServerEntity, Long> {

    @Query("select new donation.main.dto.serverdto.ServerIdNameDto(s.id, s.serverName) from ServerEntity s")
    Page<ServerIdNameDto> getAllByServerNameAndId(Pageable pageable);

    @Query("SELECT new donation.main.dto.donatorsdto.DonatorBonusDto(KEY(s.donatorsBonuses).id, " +
            "KEY(s.donatorsBonuses).email as email, VALUE(s.donatorsBonuses)) FROM ServerEntity s WHERE s.id = :id")
    Page<DonatorBonusDto> getDonatorBonusesByServerId(Long id, Pageable pageable);
}
