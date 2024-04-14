package donation.main.service;

import java.util.List;
import donation.main.dto.donatorsdto.CreateDonatorBonusOnServer;
import donation.main.dto.donatorsdto.DonatorBonusDto;
import donation.main.dto.donatorsdto.DonatorBonusOnServer;
import donation.main.dto.donatorsdto.UpdateDonatorsBonusOnServer;
import donation.main.dto.serverdto.ServerDto;
import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.DonatorEntity;
import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.entity.ServerEntity;
import donation.main.exception.ServerAlreadyExistsException;
import donation.main.exception.ServerNotFoundException;
import donation.main.mapper.DonatorMapper;
import donation.main.mapper.ServerMapper;
import donation.main.repository.DonatorRepository;
import donation.main.repository.ServerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ServerService {
    private final ServerRepository serverRepository;
    private final ServerMapper serverMapper;
    private final DonatorRepository donatorRepository;
    private final DonatorMapper donatorMapper;
    private final DonatorService donatorService;

    public Page<ServerEntity> getAll(Pageable pageable) {
        return serverRepository.findAll(pageable);
    }

    public List<DonatorBonusOnServer> findAllBonusesOnServersByDonatorId(Long id) {
        return serverRepository.findAllBonusesFromServersByDonatorId(id);
    }

    public Page<ServerIdNameDto> getAllServersNames(Pageable pageable) {
        return serverRepository.getAllByServerNameAndId(pageable);
    }

    public ServerEntity create(ServerDto dto) {
        if (serverRepository.existsServerEntitiesByServerName(dto.serverName())) {
            throw new ServerAlreadyExistsException("Server already exists with name:", dto.serverName());
        }
        ServerEntity server = serverMapper.toEntity(dto);
        server.getServerBonusSettings().add(ServerBonusSettingsEntity.builder().server(server).build());
        return serverRepository.save(server);
    }

    public ServerDto getServerById(Long serverId) {
        ServerDto serverEntity = serverRepository.findServerById(serverId).orElseThrow(
                () -> new ServerNotFoundException("Server not found by Id= ", serverId)
        );
        return serverMapper.toDto(serverEntity);
    }

    @Transactional
    public void updateServer(Long serverId, ServerDto dto) {
        ServerEntity server = findById(serverId);
        serverMapper.update(server, dto);
    }

    public ServerEntity findById(Long id) {
        return serverRepository.findById(id)
                .orElseThrow(() -> new ServerNotFoundException("Server not found by Id=", id));
    }

    public ServerEntity createDonatorsBonusOnServer(Long serverId, Long donatorId, CreateDonatorBonusOnServer dto) {
        //todo here should be connect to server with gamers
        DonatorEntity donator = donatorRepository.findById(donatorId)
                .orElseGet(() -> donatorRepository.save(donatorMapper.toEntity(dto)));
        ServerEntity server = findById(serverId);
        server.getDonatorsBonuses().put(donator, dto.personalBonus());
        return serverRepository.save(server);
    }

    public ServerEntity updateDonatorsBonusOnServer(Long serverId, Long donatorId, UpdateDonatorsBonusOnServer dto) {
        DonatorEntity donator = donatorService.findById(donatorId);
        ServerEntity server = findById(serverId);
        server.getDonatorsBonuses().put(donator, dto.personalBonus());
        return serverRepository.save(server);

    }

    public Page<DonatorBonusDto> getAllDonatorBonusesByServerId(Long serverId, Pageable pageable) {
        return getPage(serverRepository.getDonatorBonusesByServerId(serverId, pageable.getSort()), pageable);
    }

    public Page<DonatorBonusDto> searchDonatorsByEmailLike(Long serverId, String email, Pageable pageable) {
        return getPage(serverRepository
                .getBonusesByServerIdAndDonatorsEmail(serverId, email, pageable.getSort()), pageable);
    }

    @Transactional
    public void deleteServerById(Long id) {
        serverRepository.deleteServerEntityById(id);
    }

    private Page<DonatorBonusDto> getPage(List<DonatorBonusDto> donatorBonuses, Pageable pageable) {
        int totalElements = donatorBonuses.size();
        int toIndex = (donatorBonuses.size() - 1) >= pageable.getPageSize() + pageable.getOffset()
                ? pageable.getPageSize() + (int) pageable.getOffset()
                : donatorBonuses.size();
        if (pageable.getOffset() < toIndex) {
            donatorBonuses = donatorBonuses.subList((int) pageable.getOffset(), toIndex);
        }
        return new PageImpl<>(donatorBonuses, pageable, totalElements);
    }
}
