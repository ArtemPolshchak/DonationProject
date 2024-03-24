package donation.main.service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.TreeSet;

import donation.main.dto.donatorsdto.CreateDonatorBonusOnServer;
import donation.main.dto.donatorsdto.DonatorBonusDto;
import donation.main.dto.donatorsdto.UpdateDonatorsBonusOnServer;
import donation.main.dto.serverdto.CreateServerDto;
import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.DonatorEntity;
import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.entity.ServerEntity;
import donation.main.exception.PageNotFoundException;
import donation.main.exception.ServerNotFoundException;
import donation.main.mapper.DonatorMapper;
import donation.main.mapper.ServerMapper;
import donation.main.repository.DonatorRepository;
import donation.main.repository.ServerRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.SoftDelete;
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

    public Page<ServerIdNameDto> getAllServersNames(Pageable pageable) {
        return serverRepository.getAllByServerNameAndId(pageable);
    }

    public ServerEntity createServer(CreateServerDto serverDto) {
        ServerEntity server = serverMapper.toEntity(serverDto);
        server.setServerBonusSettings(new TreeSet<>(Collections.singletonList(createDefaultBonusForNewServer(server))));
        return serverRepository.save(server);
    }

    public ServerEntity findById(Long id) {
        return serverRepository.findById(id)
                .orElseThrow(() -> new ServerNotFoundException("Server not found by Id=", id));
    }

    public ServerEntity createDonatorsBonusOnServer(CreateDonatorBonusOnServer dto) {

        //todo here should be connect to server with gamers
        DonatorEntity donator = donatorRepository.findByEmail(dto.email())
                .orElseGet(() -> donatorRepository.save(donatorMapper.toEntity(dto)));

        ServerEntity server = findById(dto.serverId());

        server.getDonatorsBonuses().put(donator, dto.personalBonus());

        return serverRepository.save(server);
    }

    public ServerEntity updateDonatorsBonusOnServer(UpdateDonatorsBonusOnServer dto) {
        DonatorEntity donator = donatorService.findById(dto.donatorId());
        ServerEntity server = findById(dto.serverId());
        BigDecimal donatorsBonus = dto.personalBonus();

        server.getDonatorsBonuses().put(donator, donatorsBonus);
        return serverRepository.save(server);

    }

    public Page<DonatorBonusDto> getAllDonatorBonusesByServerId(Long serverId, Pageable pageable) {
        return getPage(serverRepository.getDonatorBonusesByServerId(serverId, pageable.getSort()), pageable);
    }

    public Page<DonatorBonusDto> searchDonatorsByEmailLike(Long serverId, String email, Pageable pageable) {
        return getPage(serverRepository
                .getBonusesByServerIdAndDonatorsEmail(serverId, email, pageable.getSort()), pageable);
    }

    @SoftDelete
    public ServerEntity delete() {
        return null;
    }

    private Page<DonatorBonusDto> getPage(List<DonatorBonusDto> donatorBonuses, Pageable pageable) {
        int toIndex = (donatorBonuses.size() - 1) > pageable.getPageSize() + pageable.getOffset()
                ? pageable.getPageSize() + (int) pageable.getOffset()
                : donatorBonuses.size();
        if (pageable.getOffset() >= toIndex) {
            throw new PageNotFoundException("There is no page number " + pageable.getPageNumber());
        }
        return new PageImpl<>(
                donatorBonuses.subList((int) pageable.getOffset(), toIndex),
                pageable, donatorBonuses.size());
    }

    private ServerBonusSettingsEntity createDefaultBonusForNewServer(ServerEntity server) {
        ServerBonusSettingsEntity defaultBonus = new ServerBonusSettingsEntity();
        defaultBonus.setBonusPercentage(BigDecimal.ZERO);
        defaultBonus.setFromAmount(BigDecimal.ZERO);
        defaultBonus.setToAmount(BigDecimal.ZERO);
        defaultBonus.setServer(server);
        return defaultBonus;
    }
}
