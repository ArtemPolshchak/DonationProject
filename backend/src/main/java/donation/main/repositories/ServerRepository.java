package donation.main.repositories;

import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.ServerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ServerRepository extends JpaRepository<ServerEntity, Long> {

    @Query("select new donation.main.dto.serverdto.ServerIdNameDto(s.id, s.serverName) from ServerEntity s")
    List<ServerIdNameDto> getAllByServerNameAndId();
}
