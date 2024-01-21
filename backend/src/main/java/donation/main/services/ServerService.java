package donation.main.services;


import donation.main.dto.serverdto.CreateServerDto;
import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.ServerEntity;
import donation.main.mapper.CreateServerMapper;
import donation.main.repositories.ServerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ServerService {
    private final ServerRepository serverRepository;
    private final CreateServerMapper createServerMapper;

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

}
