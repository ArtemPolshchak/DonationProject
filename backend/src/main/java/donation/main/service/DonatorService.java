package donation.main.service;

import donation.main.dto.donator.CreateDonatorDto;
import donation.main.dto.donator.DonatorTotalDonationsView;
import donation.main.entity.DonatorEntity;
import donation.main.exception.EmailNotFoundException;
import donation.main.exception.UserNotFoundException;
import donation.main.mapper.DonatorMapper;
import donation.main.repository.DonatorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class DonatorService {
    private final DonatorRepository donatorRepository;
    private final DonatorMapper donatorMapper;
    private final ApiService apiService;

    public Page<DonatorEntity> findAll(Pageable pageable) {
        return donatorRepository.findAll(pageable);
    }

    public DonatorEntity findById(Long id) {
        return getById(id);
    }

    public Page<DonatorTotalDonationsView> getTotalDonationsByEmailLikeAndServerName(
            String email, Long serverId, Pageable pageable) {
        return donatorRepository.findTotalDonationsByEmailLikeAndServerName(email, serverId, pageable);
    }

    private DonatorEntity getById(Long id) {
        return donatorRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Can't find Donator by id " + id));
    }

    public Page<DonatorEntity> findByEmailLike(String mail, Pageable pageable) {
        return donatorRepository.findByEmailContainingIgnoreCase(mail, pageable);
    }

    public DonatorEntity create(CreateDonatorDto dto) {
        return donatorRepository.save(donatorMapper.toEntity(dto));
    }

    public DonatorEntity getByEmailOrCreate(String email) {
        return donatorRepository.findByEmail(email)
                .orElseGet(() -> donatorRepository.save(DonatorEntity.builder().email(email).build()));
    }

    public void validateDonatorEmail(String donatorEmail) {
        apiService.existsByEmail(donatorEmail)
                .flatMap(exists -> {
                    if (!exists) {
                        return Mono.error(
                                new EmailNotFoundException("Donator with the email does not exist:", donatorEmail));
                    }
                    return Mono.empty();
                })
                .block();
    }
}
