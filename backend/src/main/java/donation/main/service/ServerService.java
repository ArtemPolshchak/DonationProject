package donation.main.service;

import donation.main.dto.donatorsdto.CreateDonatorBonusOnServer;
import donation.main.dto.donatorsdto.DonatorBonusDto;
import donation.main.dto.donatorsdto.UpdateDonatorsBonusOnServer;
import donation.main.dto.serverdto.CreateServerDto;
import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.DonatorEntity;
import donation.main.entity.ServerEntity;
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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
        return serverRepository.save(serverMapper.toEntity(serverDto));
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

    public Page<DonatorBonusDto> findDonatorsBonusesByServerId(Long serverId, Pageable pageable) {
        return serverRepository.getDonatorBonusesByServerId(serverId, pageable);
    }

    public Page<DonatorBonusDto> searchDonatorsByEmailContains(Long serverId, String email, Pageable pageable) {
        ServerEntity server = findById(serverId);
        List<DonatorBonusDto> donatorBonusDtos = getDonatorBonusesList(server);

        List<DonatorBonusDto> filteredDonatorBonusDtos = donatorBonusDtos.stream()
                .filter(dto -> dto.email().toLowerCase().contains(email.toLowerCase()))
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredDonatorBonusDtos.size());
        return new PageImpl<>(filteredDonatorBonusDtos.subList(start, end), pageable, filteredDonatorBonusDtos.size());
    }

    private List<DonatorBonusDto> getDonatorBonusesList(ServerEntity server) {
        List<DonatorBonusDto> donatorBonusDtos = new ArrayList<>();
        Map<DonatorEntity, BigDecimal> donatorsBonuses = server.getDonatorsBonuses();

        for (Map.Entry<DonatorEntity, BigDecimal> entry : donatorsBonuses.entrySet()) {
            DonatorEntity donator = entry.getKey();
            BigDecimal bonus = entry.getValue();
            donatorBonusDtos.add(new DonatorBonusDto(donator.getId(), donator.getEmail(), bonus));
        }

        return donatorBonusDtos;
    }

    @SoftDelete
    public ServerEntity delete() {
        return null;
    }
}
