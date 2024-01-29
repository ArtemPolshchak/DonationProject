package donation.main.service;

import donation.main.dto.donatorsdto.CreateDotatorDto;
import donation.main.entity.DonatorEntity;
import donation.main.exception.EmailNotFoundException;
import donation.main.mapper.DonatorMapper;
import donation.main.repository.DonatorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DonatorService {
    private final DonatorRepository donatorRepository;
    private final DonatorMapper donatorMapper;

    public Iterable<DonatorEntity> readAll() {
        return donatorRepository.findAll();
    }

    public DonatorEntity findByMail(String email) {
        return donatorRepository.findByEmail(email).orElseThrow(() -> new EmailNotFoundException(
                "Email not found", email));
    }

    public Page<DonatorEntity> findByMailPaginated(String mail, Pageable pageable) {
        return donatorRepository.findByEmailContainingIgnoreCase(mail, pageable);
    }

    public DonatorEntity createDonator(CreateDotatorDto dotatorDto) {
        return donatorRepository.save(donatorMapper.toEntity(dotatorDto));
    }

    public DonatorEntity getDonatorEntityOrCreate(String donatorEmail) {
        try {
            return findByMail(donatorEmail);
        } catch (EmailNotFoundException e) {
            return createDonator(new CreateDotatorDto(donatorEmail));
        }
    }

    public boolean existsByEmail(String email) {
        return donatorRepository.existsByEmail(email);
    }
}
