package donation.main.service;

import donation.main.dto.serverbonusdto.CreateServerBonusesDto;
import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.entity.ServerEntity;
import donation.main.exception.InvalidBonusRangeException;
import donation.main.exception.ServerNotFoundException;
import donation.main.mapper.ServerBonusSettingsMapper;
import donation.main.repository.ServerBonusSettingsRepository;
import donation.main.repository.ServerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public Page<ServerBonusSettingsEntity> readAll(Pageable pageable) {
        return serverBonusSettingsRepository.findAllBy(pageable);
    }

    public Set<ServerBonusSettingsEntity> replaceAll(List<CreateServerBonusesDto> serverBonusesDtos, Long serverId) {
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
    private boolean isBonusRangesValid(List<CreateServerBonusesDto> serverBonusesDtos) {
        // Перевірка, щоб FromAmount було менше за ToAmount для кожного бонусу
        boolean fromToValid = serverBonusesDtos.stream()
                .allMatch(bonus -> bonus.fromAmount() == null || bonus.toAmount() == null || bonus.fromAmount().compareTo(bonus.toAmount()) < 0);

        // Перевірка, щоб toAmount поточного бонусу був менше за fromAmount наступного бонусу
        boolean toFromValid = IntStream.range(0, serverBonusesDtos.size() - 1)
                .allMatch(i -> {
                    BigDecimal currentToAmount = serverBonusesDtos.get(i).toAmount();
                    BigDecimal nextFromAmount = serverBonusesDtos.get(i + 1).fromAmount();
                    return currentToAmount == null || nextFromAmount == null || currentToAmount.compareTo(nextFromAmount) < 0;
                });

        return fromToValid && toFromValid;
    }

//    private boolean isBonusRangesValid(List<CreateServerBonusesDto> serverBonusesDtos) {
//        for (int i = 0; i < serverBonusesDtos.size() - 1; i++) {
//            CreateServerBonusesDto currentBonus = serverBonusesDtos.get(i);
//            CreateServerBonusesDto nextBonus = serverBonusesDtos.get(i + 1);
//
//            BigDecimal currentFromAmount = currentBonus.fromAmount();
//            BigDecimal currentToAmount = currentBonus.toAmount();
//            BigDecimal nextFromAmount = nextBonus.fromAmount();
//            BigDecimal nextToAmount = nextBonus.toAmount();
//
//            // Перевірка, щоб FromAmount було менше за ToAmount
//            if ((currentFromAmount != null && currentToAmount != null && currentFromAmount.compareTo(currentToAmount) >= 0) ||
//                    (nextFromAmount != null && nextToAmount != null && nextFromAmount.compareTo(nextToAmount) >= 0)) {
//                return false;
//            }
//
//            // Перевірка, щоб toAmount поточного бонусу був менше за fromAmount наступного бонусу
//            if (currentToAmount != null && nextFromAmount != null && currentToAmount.compareTo(nextFromAmount) >= 0) {
//                return false;
//            }
//        }
//        return true;
//    }
}
