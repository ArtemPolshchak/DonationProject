package donation.main.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import donation.main.dto.donatorsdto.DonatorBonusDto;
import donation.main.dto.donatorsdto.DonatorsBonusesOnServers;
import donation.main.dto.serverdto.ServerDto;
import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.ServerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServerRepository extends JpaRepository<ServerEntity, Long> {

    @Query("SELECT new donation.main.dto.serverdto.ServerIdNameDto(s.id, s.serverName) FROM ServerEntity s")
    Page<ServerIdNameDto> getAllByServerNameAndId(Pageable pageable);

    @Query("SELECT new donation.main.dto.donatorsdto.DonatorBonusDto("
            + "KEY(s.donatorsBonuses).id as id, "
            + "KEY(s.donatorsBonuses).email as email, "
            + "VALUE(s.donatorsBonuses)) FROM ServerEntity s WHERE s.id = :id ")
    List<DonatorBonusDto> getDonatorBonusesByServerId(Long id, Sort sort);

    @Query("SELECT new donation.main.dto.donatorsdto.DonatorBonusDto("
            + "KEY(s.donatorsBonuses).id, "
            + "KEY(s.donatorsBonuses).email as email, "
            + "VALUE(s.donatorsBonuses)) "
            + "FROM ServerEntity s WHERE s.id = :id AND LOWER(KEY(s.donatorsBonuses).email) "
            + "LIKE LOWER(CONCAT('%', :email, '%'))")
    List<DonatorBonusDto> getBonusesByServerIdAndDonatorsEmail(
            Long id, @Param("email") String email, Sort sort);

    boolean existsServerEntitiesByServerName(String serverName);

    @Query("SELECT new donation.main.dto.serverdto.ServerDto("
            + " s.serverName as serverName, "
            + " s.serverUrl as serverUrl, "
            + "s.serverUserName as serverUserName, "
            + " s.serverPassword as serverPassword) FROM ServerEntity s WHERE s.id = :id ")
    Optional<ServerDto> findServerById(Long id);

    void deleteServerEntityById(Long id);

    @Query("SELECT NEW donation.main.dto.donatorsdto.DonatorsBonusesOnServers(s.id, VALUE(b)) " +
            "FROM ServerEntity s JOIN s.donatorsBonuses b " +
            "WHERE KEY(b).id = :donatorId " +
            "GROUP BY s.id, VALUE(b)")
    List<DonatorsBonusesOnServers> findAllDonatorsBonusesFromServersByDonatorId(@Param("donatorId") Long donatorId);

}
