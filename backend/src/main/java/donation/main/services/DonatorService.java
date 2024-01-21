package donation.main.services;

import donation.main.dto.donatorsdto.CreateDotatorDto;
import donation.main.entity.DonatorEntity;
import donation.main.entity.ServerEntity;
import donation.main.mapper.CreateDonatorMapper;
import donation.main.repositories.DonatorRepository;
import donation.main.repositories.ServerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class DonatorService {
    private final DonatorRepository donatorRepository;
    private final CreateDonatorMapper donatorMapper;
    private final ServerRepository serverRepository;

    public Iterable<DonatorEntity> readAll() {
        return donatorRepository.findAll();
    }

    public DonatorEntity findByMail(String email) {
        return donatorRepository.findByMail(email).orElseThrow(NoSuchElementException::new);
    }

    public Page<DonatorEntity> findByMailPaginated(String mail, Pageable pageable) {
        return donatorRepository.findByMailContainingIgnoreCase(mail, pageable);
    }

    public DonatorEntity createDonator(CreateDotatorDto dotatorDto) {
        return donatorRepository.save(donatorMapper.toEntity(dotatorDto));
    }
}
