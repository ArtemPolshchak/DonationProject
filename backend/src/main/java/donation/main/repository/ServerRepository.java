package donation.main.repository;

import java.util.List;
import java.util.Optional;

import donation.main.dto.donator.DonatorBonusDto;
import donation.main.dto.donator.DonatorBonusOnServer;
import donation.main.dto.server.ServerDto;
import donation.main.dto.server.ServerIdNameDto;
import donation.main.entity.ServerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServerRepository extends JpaRepository<ServerEntity, Long> {

    @Query("SELECT new donation.main.dto.server.ServerIdNameDto(s.id, s.serverName) FROM ServerEntity s")
    Page<ServerIdNameDto> getAllByServerNameAndId(Pageable pageable);

    @Query("SELECT new donation.main.dto.donator.DonatorBonusDto("
            + "KEY(s.donatorsBonuses).id as id, "
            + "KEY(s.donatorsBonuses).email as email, "
            + "VALUE(s.donatorsBonuses)) FROM ServerEntity s WHERE s.id = :id ")
    List<DonatorBonusDto> getDonatorBonusesByServerId(Long id, Sort sort);

    @Query("SELECT new donation.main.dto.donator.DonatorBonusDto("
            + "KEY(s.donatorsBonuses).id, "
            + "KEY(s.donatorsBonuses).email as email, "
            + "VALUE(s.donatorsBonuses) as personalBonus) "
            + "FROM ServerEntity s WHERE s.id = :id AND LOWER(KEY(s.donatorsBonuses).email) "
            + "LIKE LOWER(CONCAT('%', :email, '%'))")
    List<DonatorBonusDto> getBonusesByServerIdAndDonatorsEmail(
            Long id, @Param("email") String email, Sort sort);

    boolean existsServerEntitiesByServerName(String serverName);

    @Query("SELECT new donation.main.dto.server.ServerDto("
            + " s.serverName as serverName, "
            + " s.serverUrl as serverUrl, "
            + "s.serverUserName as serverUserName, "
            + " s.serverPassword as serverPassword, "
            + " s.serverId as serverId, "
            + "s.publicKey as publicKey,"
            + "s.secretKey as secretKey) FROM ServerEntity s WHERE s.id = :id ")
    Optional<ServerDto> findServerById(Long id);

    void deleteServerEntityById(Long id);

    @Query("SELECT NEW donation.main.dto.donator.DonatorBonusOnServer(s.id, s.serverName, COALESCE(VALUE(b), 0)) "
            + "FROM ServerEntity s LEFT JOIN s.donatorsBonuses b "
            + "ON KEY(b).id = :donatorId "
            + "GROUP BY s.id, s.serverName, b")
    List<DonatorBonusOnServer> findAllBonusesFromServersByDonatorId(@Param("donatorId") Long donatorId);

    @Modifying()
    @Query(nativeQuery = true, value = "INSERT INTO servers_donators_bonuses (server_id, donator_id, donators_bonuses, deleted) "
            + "VALUES(:serverId, :donatorId, :bonus,'F') "
            + "ON CONFLICT (server_id, donator_id) "
            + "DO UPDATE SET donators_bonuses = :bonus")
    void updateDonatorServerBonuses(Long donatorId, Long serverId, int bonus);

    @Modifying()
    @Query(nativeQuery = true, value = "DELETE FROM servers_donators_bonuses "
            + "WHERE server_id = :serverId "
            + "AND donator_id = :donatorId")
    void deleteDonatorServerBonuses(Long donatorId, Long serverId);
}
