package donation.main.service;

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
import donation.main.exception.AccessForbiddenException;
import donation.main.exception.EmailNotFoundException;
import donation.main.exception.InvalidTransactionState;
import donation.main.exception.TransactionNotFoundException;
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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.SortedSet;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final SpecificationBuilder<TransactionEntity> specificationBuilder;
    private final TransactionMapper transactionMapper;
    private final DonatorService donatorService;
    private final ServerService serverService;
    private final ExternalDonatorService externalDonatorService;
    private final TransactionStateManager transactionStateManager;
    private final UserService userService;

    public Page<TransactionResponseDto> getAll(Pageable pageable) {
        return transactionRepository.findAll(pageable).map(transactionMapper::toDto);
    }

    public Page<TransactionResponseDto> findAllTransactionsByDonatorId(Long donatorId, Pageable pageable) {
        return transactionRepository.findAllByDonatorId(donatorId,  pageable).map(transactionMapper::toDto);
    }

    public Page<TransactionResponseDto> findAllByState(TransactionState state, Pageable pageable) {
        return transactionRepository.findAllByState(state, pageable).map(transactionMapper::toDto);
    }

    public TransactionEntity findById(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found with id: " + transactionId));
    }

    public Page<TransactionEntity> search(TransactionSpecDto specDto, Pageable pageable) {
        Specification<TransactionEntity> spec = specificationBuilder.build(specDto);
        return transactionRepository.findAll(spec, pageable);
    }

    public TransactionEntity save(TransactionEntity entity) {
        return transactionRepository.save(entity);
    }

    public TransactionEntity updateTransaction(Long transactionId, UpdateTransactionDto transactionDto) {
        TransactionEntity existingTransaction = findById(transactionId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ServerEntity serverById = serverService.findById(transactionDto.serverId());
        DonatorEntity donatorEntity = donatorService.getDonatorEntityOrCreate(existingTransaction.getDonator().getEmail());

        BigDecimal personalBonus = serverById.getDonatorsBonuses().getOrDefault(donatorEntity, BigDecimal.ZERO);
       // BigDecimal contributionAmount = transactionDto.contributionAmount();
        BigDecimal totalBonus = calculateTotalBonus(transactionDto.contributionAmount(), serverById, personalBonus);
        BigDecimal totalAmount = getTotalAmount(transactionDto.contributionAmount(), totalBonus);

        updateTransactionEntity(existingTransaction, donatorEntity, serverById, totalAmount, transactionDto.contributionAmount());

        setCreateTransactionByUser(authentication, existingTransaction);

        return transactionRepository.save(existingTransaction);

    }

    public TransactionEntity updateTransactionState(Long transactionId, TransactionState newState) {
        TransactionEntity existingTransactionEntity = findById(transactionId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        TransactionState state = existingTransactionEntity.getState();

        if (!transactionStateManager.isAllowedTransitionState(state, newState)) {
            throw new InvalidTransactionState("This state cannot be set up, check state", newState);
        }
        existingTransactionEntity.setState(newState);

        countDonatorsTotalDonation(newState, existingTransactionEntity);

        existingTransactionEntity.setDateApproved(LocalDateTime.now());
        if (approveTransactionByUser(authentication)) {
            existingTransactionEntity.setApprovedByUser(userService.getCurrentUser());
        }
        return save(existingTransactionEntity);
    }

    private void countDonatorsTotalDonation(TransactionState newState, TransactionEntity existingTransactionEntity) {
        if (newState == TransactionState.COMPLETED) {
            BigDecimal amount = existingTransactionEntity
                    .getDonator()
                    .getTotalDonations()
                    .add(existingTransactionEntity
                            .getContributionAmount());
            existingTransactionEntity.getDonator().setTotalDonations(amount);
        }
    }

    public TransactionEntity create(CreateTransactionDto transactionDto) {
        validateDonatorEmail(transactionDto.donatorEmail());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ServerEntity serverById = serverService.findById(transactionDto.serverId());
        DonatorEntity donatorEntity = donatorService.getDonatorEntityOrCreate(transactionDto.donatorEmail());
        BigDecimal personalBonus = serverById.getDonatorsBonuses().getOrDefault(donatorEntity, BigDecimal.ZERO);

        BigDecimal contributionAmount = transactionDto.contributionAmount();
        BigDecimal totalBonus = calculateTotalBonus(contributionAmount, serverById, personalBonus);
        BigDecimal totalAmount = getTotalAmount(transactionDto.contributionAmount(), totalBonus);

        TransactionEntity entity = createTransactionEntity(transactionDto, donatorEntity, serverById, totalAmount);
        setCreateTransactionByUser(authentication, entity);

        return transactionRepository.save(entity);
    }

    private void validateDonatorEmail(String donatorEmail) {
        if (!externalDonatorService.existsByEmail(donatorEmail)) {
            throw new EmailNotFoundException("Donator with the email does not exist:", donatorEmail);
        }
    }

    private BigDecimal calculateTotalBonus(BigDecimal contributionAmount, ServerEntity serverById, BigDecimal personalBonus) {
        SortedSet<ServerBonusSettingsEntity> serverBonusSettings = serverById.getServerBonusSettings();
        ServerBonusSettingsEntity last = serverBonusSettings.last();

        if (last.getToAmount().compareTo(contributionAmount) <= 0) {
            return last.getBonusPercentage();
        } else {
            BigDecimal serverBonus = getServerBonus(contributionAmount, serverById);
            return personalBonus.add(serverBonus);
        }
    }

    private TransactionEntity createTransactionEntity(CreateTransactionDto formDto, DonatorEntity donatorEntity,
                                                      ServerEntity serverById, BigDecimal totalAmount) {
        TransactionEntity entity = transactionMapper.toEntity(formDto);
        entity.setDonator(donatorEntity);
        entity.setServer(serverById);
        entity.setTotalAmount(totalAmount);
        return entity;
    }

    private void updateTransactionEntity(TransactionEntity entity,
                                         DonatorEntity donatorEntity,
                                         ServerEntity serverById,
                                         BigDecimal totalAmount,
                                         BigDecimal contributionAmount) {
        entity.setContributionAmount(contributionAmount);
        entity.setDonator(donatorEntity);
        entity.setServer(serverById);
        entity.setTotalAmount(totalAmount);

    }

    private BigDecimal getTotalAmount(BigDecimal incomingAmount, BigDecimal totalBonus) {
        return totalBonus.equals(BigDecimal.ZERO)
                ? incomingAmount
                : countResult(incomingAmount, totalBonus);
    }

    private BigDecimal getServerBonus(BigDecimal contributionAmount, ServerEntity serverById) {
        return serverById.getServerBonusSettings().stream()
                .filter(a -> (contributionAmount.compareTo(a.getFromAmount()) > 0
                        && contributionAmount.compareTo(a.getToAmount()) <= 0))
                .map(ServerBonusSettingsEntity::getBonusPercentage)
                .findFirst()
                .orElse(BigDecimal.ZERO);
    }

    private BigDecimal countResult(BigDecimal contributionAmount, BigDecimal totalBonus) {
        return contributionAmount.multiply(BigDecimal.ONE.add(totalBonus.divide(BigDecimal.valueOf(100.0))));
    }

    private void setCreateTransactionByUser(Authentication authentication, TransactionEntity entity) {
        if (authentication != null && authentication.getPrincipal() instanceof UserEntity user) {
            entity.setCreatedByUser(user);
        } else {
            throw new UserNotFoundException("Unable to retrieve user information from Security Context.");
        }
    }

    private boolean approveTransactionByUser(Authentication authentication) {

        boolean result = false;

        for (GrantedAuthority authority : authentication.getAuthorities()) {
            String role = authority.getAuthority();
            if ("ADMIN".equals(role)) {
                result = true;

            } else {
                throw new AccessForbiddenException("Access forbidden for the current user. Admin access required", role);
            }
        }

        return result;
    }
}
