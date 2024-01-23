package donation.main.service;


import donation.main.dto.donatorsdto.CreateDonatorBonusOnServer;
import donation.main.dto.serverdto.CreateServerDto;
import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.DonatorEntity;
import donation.main.entity.ServerEntity;
import donation.main.mapper.CreateDonatorMapper;
import donation.main.mapper.CreateServerMapper;
import donation.main.repository.DonatorRepository;
import donation.main.repository.ServerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ServerService {
    private final ServerRepository serverRepository;
    private final CreateServerMapper createServerMapper;
    private final DonatorRepository donatorRepository;
    private final DonatorService donatorService;
    private final CreateDonatorMapper donatorMapper;

    public Iterable<ServerEntity> readAll() {
        return serverRepository.findAll();
    }

    public List<ServerIdNameDto> getAllServersNames() {
        return serverRepository.getAllByServerNameAndId();
    }

    public ServerEntity createServer(CreateServerDto serverDto) {
        return serverRepository.save(createServerMapper.toEntity(serverDto));
    }

    public ServerEntity findById(Long id) {
        return serverRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    public ServerEntity createDonatorsBonusOnServer(CreateDonatorBonusOnServer dto) {

        //todo here should be connect to server with gamers
        DonatorEntity donator = donatorRepository.findByEmail(dto.email()).orElseGet(() -> donatorRepository.save(donatorMapper.toEntity(dto)));

        ServerEntity serverById = serverRepository.findById(dto.serverId()).orElseThrow(NoSuchElementException::new);

        serverById.getDonatorsBonuses().put(donator, dto.personalBonus());

        return serverRepository.save(serverById);
    }

}
