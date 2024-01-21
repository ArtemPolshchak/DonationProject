package donation.main.services;

import donation.main.dto.donatorsdto.CreateDotatorDto;
import donation.main.dto.transactiondto.CreateTransactionFormDto;
import donation.main.dto.transactiondto.TransactionSpecDto;
import donation.main.entity.DonatorEntity;
import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.entity.ServerEntity;
import donation.main.entity.TransactionEntity;
import donation.main.enumeration.TransactionState;
import donation.main.mapper.CreateTransactionFormMapper;
import donation.main.repositories.TransactionRepository;
import donation.main.repositories.spec.SpecificationBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final SpecificationBuilder<TransactionEntity> specificationBuilder;
    private final CreateTransactionFormMapper createTransactionFormMapper;
    private final DonatorService donatorService;
    private final ServerService serverService;

    public Page<TransactionEntity> readAll(Pageable pageable) {
        return transactionRepository.findAll(pageable);
    }

    public Page<TransactionEntity> findAllByState(TransactionState state, Pageable pageable) {
        return transactionRepository.findAllByState(state, pageable);
    }

    public Page<TransactionEntity> search(TransactionSpecDto specDto, Pageable pageable) {
        Specification<TransactionEntity> spec = specificationBuilder.build(specDto);
        return transactionRepository.findAll(spec, pageable);
    }

    public TransactionEntity create(CreateTransactionFormDto formDto) {
        ServerEntity serverById = serverService.findById(formDto.serverId());

        DonatorEntity donatorEntity;
        try {
            donatorEntity = donatorService.findByMail(formDto.donatorEmail());
        } catch (NoSuchElementException e) {
            donatorEntity = donatorService.createDonator(new CreateDotatorDto(formDto.donatorEmail()));
        }

        BigDecimal personalBonus = serverById.getDonatorsBonuses().get(donatorEntity);

        if (personalBonus == null) {
            personalBonus = BigDecimal.ZERO;
        }

        BigDecimal serverBonus = serverById.getServerBonusSettings().stream()
                .filter(a -> formDto.contributionAmount().compareTo(a.getFromAmount()) > 0
                        && formDto.contributionAmount().compareTo(a.getToAmount()) <= 0)
                .map(ServerBonusSettingsEntity::getBonusPercentage)
                .findFirst()
                .orElse(BigDecimal.ZERO);

        BigDecimal totalBonus = personalBonus.add(serverBonus);
        BigDecimal totalAmount;

        totalAmount = !totalBonus.equals(BigDecimal.ZERO)
                ? totalBonus.multiply(formDto.contributionAmount())
                : formDto.contributionAmount();

        TransactionEntity entity = createTransactionFormMapper.toEntity(formDto);
        entity.setDonator(donatorEntity);
        //todo set user from security context
        // entity.setCreatedByUser("securityContextUser")
        entity.setServer(serverById);
        entity.setTotalAmount(totalAmount);

        return transactionRepository.save(entity);
    }
}
