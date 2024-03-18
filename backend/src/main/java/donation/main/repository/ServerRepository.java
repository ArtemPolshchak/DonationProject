package donation.main.repository;

import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.ServerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ServerRepository extends JpaRepository<ServerEntity, Long> {

    @Query("select new donation.main.dto.serverdto.ServerIdNameDto(s.id, s.serverName) from ServerEntity s")
    Page<ServerIdNameDto> getAllByServerNameAndId(Pageable pageable);
}
