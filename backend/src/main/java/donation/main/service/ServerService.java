package donation.main.service;

import donation.main.dto.donatorsdto.CreateDonatorBonusOnServer;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServerService {
    private final ServerRepository serverRepository;
    private final ServerMapper serverMapper;
    private final DonatorRepository donatorRepository;
    private final DonatorMapper donatorMapper;
    private final DonatorService donatorService;

    public Iterable<ServerEntity> readAll() {
        return serverRepository.findAll();
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

    public ServerEntity updateDonatorsBonusOnserver(UpdateDonatorsBonusOnServer dto) {
        DonatorEntity donator = donatorService.findById(dto.donatorId());
        ServerEntity server = findById(dto.serverId());
        BigDecimal donatorsBonus = dto.personalBonus();

        server.getDonatorsBonuses().put(donator, donatorsBonus);
        return serverRepository.save(server);

    }
}
