package donation.main.service;

import donation.main.dto.donatorsdto.CreateDotatorDto;
import donation.main.dto.transactiondto.CreateTransactionDto;
import donation.main.dto.transactiondto.TransactionResponseDto;
import donation.main.dto.transactiondto.TransactionSpecDto;
import donation.main.dto.transactiondto.UpdateTransactionDto;
import donation.main.entity.DonatorEntity;
import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.entity.ServerEntity;
import donation.main.entity.TransactionEntity;
import donation.main.entity.UserEntity;
import donation.main.enumeration.TransactionState;
import donation.main.exception.EmailNotFoundException;
import donation.main.exception.UserNotFoundException;
import donation.main.externaldb.service.ExternalDonatorService;
import donation.main.mapper.TransactionMapper;
import donation.main.repository.TransactionRepository;
import donation.main.repository.spec.SpecificationBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.SortedSet;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final SpecificationBuilder<TransactionEntity> specificationBuilder;
    private final TransactionMapper transactionMapper;
    private final DonatorService donatorService;
    private final ServerService serverService;
    private final ExternalDonatorService externalDonatorService;

    public Page<TransactionResponseDto> getAll(Pageable pageable) {
        return transactionRepository.findAll(pageable).map(transactionMapper::toDto);
    }

    public Page<TransactionEntity> findAllByState(TransactionState state, Pageable pageable) {
        return transactionRepository.findAllByState(state, pageable);
    }

    public Page<TransactionEntity> search(TransactionSpecDto specDto, Pageable pageable) {
        Specification<TransactionEntity> spec = specificationBuilder.build(specDto);
        return transactionRepository.findAll(spec, pageable);
    }

    public TransactionEntity update(UpdateTransactionDto transactionDto) {
        return null;
    }

    public TransactionEntity create(CreateTransactionDto formDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ServerEntity serverById = serverService.findById(formDto.serverId());
        DonatorEntity donatorEntity;



        if (!externalDonatorService.existsByEmail(formDto.donatorEmail())) {
            throw new EmailNotFoundException("Donator with the email does`nt exists:", formDto.donatorEmail());
        }

        try {
            donatorEntity = donatorService.findByMail(formDto.donatorEmail());
        } catch (EmailNotFoundException e) {
            donatorEntity = donatorService.createDonator(new CreateDotatorDto(formDto.donatorEmail()));
        }

        BigDecimal personalBonus = serverById.getDonatorsBonuses().get(donatorEntity);
        BigDecimal totalBonus;
        if (personalBonus == null) {
            personalBonus = BigDecimal.ZERO;
        }

        SortedSet<ServerBonusSettingsEntity> serverBonusSettings = serverById.getServerBonusSettings();
        ServerBonusSettingsEntity last = serverBonusSettings.last();

        if (last.getToAmount().compareTo(formDto.contributionAmount()) <= 0) {
            totalBonus = last.getBonusPercentage();
        } else {
            BigDecimal serverBonus = serverById.getServerBonusSettings().stream()
                    .filter(a -> (formDto.contributionAmount().compareTo(a.getFromAmount()) > 0
                            && formDto.contributionAmount().compareTo(a.getToAmount()) <= 0))
                    .map(ServerBonusSettingsEntity::getBonusPercentage)
                    .findFirst()
                    .orElse(BigDecimal.ZERO);
            totalBonus = personalBonus.add(serverBonus);
        }

        BigDecimal totalAmount = !totalBonus.equals(BigDecimal.ZERO)
                ? countResult(formDto.contributionAmount(), totalBonus)
                : formDto.contributionAmount();

        TransactionEntity entity = transactionMapper.toEntity(formDto);
        entity.setDonator(donatorEntity);

        if (authentication != null && authentication.getPrincipal() instanceof UserEntity user) {
            entity.setCreatedByUser(user);
        } else {
            throw new UserNotFoundException("Unable to retrieve user information from Security Context.");
        }

        entity.setServer(serverById);
        entity.setTotalAmount(totalAmount);

        return transactionRepository.save(entity);

    }

    private BigDecimal countResult(BigDecimal contributionAmount, BigDecimal totalBonus) {
        return contributionAmount.multiply(BigDecimal.ONE.add(totalBonus.divide(BigDecimal.valueOf(100.0))));
    }

}
