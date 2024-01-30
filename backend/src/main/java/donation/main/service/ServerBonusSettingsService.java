package donation.main.service;

import donation.main.dto.serverbonusdto.CreateServerBonusesDto;
import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.entity.ServerEntity;
import donation.main.exception.ServerNotFoundException;
import donation.main.mapper.ServerBonusSettingsMapper;
import donation.main.repository.ServerBonusSettingsRepository;
import donation.main.repository.ServerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServerBonusSettingsService {

    private final ServerBonusSettingsRepository serverBonusSettingsRepository;
    private final ServerBonusSettingsMapper settingsMapper;
    private final ServerRepository serverRepository;

    public Iterable<ServerBonusSettingsEntity> readAll() {
        return serverBonusSettingsRepository.findAll();
    }

    public Set<ServerBonusSettingsEntity> replaceAll(List<CreateServerBonusesDto> serverBonusesDtos, Long serverId) {
        ServerEntity serverById = serverRepository.findById(serverId).orElseThrow(() -> new ServerNotFoundException(
                "Server not found", serverId));

        SortedSet<ServerBonusSettingsEntity> settingsEntities = serverBonusesDtos.stream()
                .map(settingsMapper::toEntity)
                .peek(b -> b.setServer(serverById))
                .collect(Collectors.toCollection(TreeSet::new));

        serverById.refreshBonuses(settingsEntities);

        return serverRepository.save(serverById).getServerBonusSettings();

    }
}
