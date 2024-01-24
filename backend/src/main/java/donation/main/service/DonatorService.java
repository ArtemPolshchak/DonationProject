package donation.main.service;

import donation.main.dto.donatorsdto.CreateDotatorDto;
import donation.main.entity.DonatorEntity;
import donation.main.mapper.DonatorMapper;
import donation.main.repository.DonatorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class DonatorService {
    private final DonatorRepository donatorRepository;
    private final DonatorMapper donatorMapper;

    public Iterable<DonatorEntity> readAll() {
        return donatorRepository.findAll();
    }

    public DonatorEntity findByMail(String email) {
        return donatorRepository.findByEmail(email).orElseThrow(NoSuchElementException::new);
    }

    public Page<DonatorEntity> findByMailPaginated(String mail, Pageable pageable) {
        return donatorRepository.findByEmailContainingIgnoreCase(mail, pageable);
    }

    public DonatorEntity createDonator(CreateDotatorDto dotatorDto) {
        return donatorRepository.save(donatorMapper.toEntity(dotatorDto));
    }
}
