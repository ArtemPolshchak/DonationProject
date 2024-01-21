package donation.main.services;

import donation.main.dto.serverbonusdto.CreateServerBonusesDto;
import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.entity.ServerEntity;
import donation.main.mapper.ServerBonusSettingsMapper;
import donation.main.repositories.ServerBonusSettingsRepository;
import donation.main.repositories.ServerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
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

    public Set<ServerBonusSettingsEntity> createAll(List<CreateServerBonusesDto> serverBonusesDtos, Long serverId) {
        ServerEntity serverById = serverRepository.findById(serverId).orElseThrow(NoSuchElementException::new);

       // deleteBonuses(serverById.getServerBonusSettings());

        Set<ServerBonusSettingsEntity> settingsEntities = serverBonusesDtos.stream()
                .map(settingsMapper::toEntity).peek(b -> b.setServer(serverById)).collect(Collectors.toSet());

        serverById.refreshBonuses(settingsEntities);

        return serverRepository.save(serverById).getServerBonusSettings();

    }

    private void deleteBonuses(Set<ServerBonusSettingsEntity> serverBonuses) {
        serverBonusSettingsRepository.deleteAll(serverBonuses);
    }
}
