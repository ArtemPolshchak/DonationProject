package donation.main.service;

import donation.main.dto.donatorsdto.CreateDonatorBonusOnServer;
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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServerService {
    private final ServerRepository serverRepository;
    private final ServerMapper serverMapper;
    private final DonatorRepository donatorRepository;
    private final DonatorMapper donatorMapper;

    public Iterable<ServerEntity> readAll() {
        return serverRepository.findAll();
    }

    public List<ServerIdNameDto> getAllServersNames() {
        return serverRepository.getAllByServerNameAndId();
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

        ServerEntity serverById = serverRepository.findById(dto.serverId())
                .orElseThrow(() -> new ServerNotFoundException("Server not found", dto.serverId()));

        serverById.getDonatorsBonuses().put(donator, dto.personalBonus());

        return serverRepository.save(serverById);
    }
}
