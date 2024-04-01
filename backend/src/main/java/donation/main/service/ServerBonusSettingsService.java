package donation.main.service;

import donation.main.dto.serverbonusdto.ServerBonusDto;
import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.entity.ServerEntity;
import donation.main.exception.InvalidBonusRangeException;
import donation.main.exception.ServerNotFoundException;
import donation.main.mapper.ServerBonusSettingsMapper;
import donation.main.repository.ServerBonusSettingsRepository;
import donation.main.repository.ServerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ServerBonusSettingsService {

    private final ServerBonusSettingsRepository serverBonusSettingsRepository;
    private final ServerBonusSettingsMapper settingsMapper;
    private final ServerRepository serverRepository;

    public Set<ServerBonusSettingsEntity> replaceAll(List<ServerBonusDto> serverBonusesDtos, Long serverId) {
        ServerEntity serverById = serverRepository.findById(serverId).orElseThrow(() -> new ServerNotFoundException(
                "Server not found", serverId));

        if (!isBonusRangesValid(serverBonusesDtos)) {
            throw new InvalidBonusRangeException("Invalid bonus ranges");
        }

        SortedSet<ServerBonusSettingsEntity> settingsEntities = serverBonusesDtos.stream()
                .map(settingsMapper::toEntity)
                .peek(b -> b.setServer(serverById))
                .collect(Collectors.toCollection(TreeSet::new));

        serverById.refreshBonuses(settingsEntities);

        return serverRepository.save(serverById).getServerBonusSettings();
    }

    private boolean isBonusRangesValid(List<ServerBonusDto> serverBonusesDtos) {
        boolean fromToValid = serverBonusesDtos.stream()
                .allMatch(bonus -> bonus.fromAmount() == null || bonus.toAmount() == null || bonus.fromAmount().compareTo(bonus.toAmount()) < 0);

        boolean toFromValid = IntStream.range(0, serverBonusesDtos.size() - 1)
                .allMatch(i -> {
                    BigDecimal currentToAmount = serverBonusesDtos.get(i).toAmount();
                    BigDecimal nextFromAmount = serverBonusesDtos.get(i + 1).fromAmount();
                    return currentToAmount == null || nextFromAmount == null || currentToAmount.compareTo(nextFromAmount) < 0;
                });

        return fromToValid && toFromValid;
    }

    public Set<ServerBonusDto> getServerBonusesFromServerByServerId(Long serverId) {
        if (!serverRepository.existsById(serverId)) {
            throw new ServerNotFoundException("Server does not exist by ID: ", serverId);
        }
        return serverBonusSettingsRepository.getServerBonusesFromServerByServerId(serverId);
    }
}
