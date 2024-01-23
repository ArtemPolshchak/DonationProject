package donation.main.externaldb.service;

import donation.main.externaldb.entity.ExternalDonatorEntity;
import donation.main.externaldb.repository.ExternalDonatorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExternalDonatorService {
    private final ExternalDonatorRepository donatorRepository;

    public Iterable<ExternalDonatorEntity> readAll() {
        return donatorRepository.findAll();
    }
}
