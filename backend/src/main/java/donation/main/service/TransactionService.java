package donation.main.service;

import donation.main.dto.transactiondto.TransactionConfirmRequestDto;
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
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.SortedSet;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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

    public TransactionEntity create(CreateTransactionDto dto) {
        //todo I temporoarily turn off the validation of external DB
       // validateDonatorEmail(dto.donatorEmail());

        TransactionEntity entity = transactionMapper.toEntity(dto);
        ServerEntity serverById = serverService.findById(dto.serverId());
        DonatorEntity donatorEntity = donatorService.getDonatorEntityOrCreate(dto.donatorEmail());
        return transactionRepository.save(
                setTransactionFields(entity, donatorEntity, serverById, dto.contributionAmount()));
    }

    public TransactionEntity updateTransaction(Long transactionId, UpdateTransactionDto dto) {
        TransactionEntity updatedTransaction = transactionMapper.update(getById(transactionId), dto);
        ServerEntity serverById = serverService.findById(dto.serverId());
        DonatorEntity donatorEntity = donatorService
                .getDonatorEntityOrCreate(updatedTransaction.getDonator().getEmail());
        return transactionRepository.save(
                setTransactionFields(updatedTransaction, donatorEntity, serverById, dto.contributionAmount()));

    }

    public Page<TransactionResponseDto> getAll(Pageable pageable) {
        return transactionRepository.findAll(pageable).map(transactionMapper::toDto);
    }

    public Page<TransactionResponseDto> findAllTransactionsByDonatorId(Long donatorId, Pageable pageable) {
        return transactionRepository.findAllByDonatorId(donatorId, pageable).map(transactionMapper::toDto);
    }

    public Page<TransactionResponseDto> findAllByState(TransactionState state, Pageable pageable) {
        return transactionRepository.findAllByState(state, pageable).map(transactionMapper::toDto);
    }

    public TransactionEntity getById(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found with id: " + transactionId));
    }

    public Page<TransactionResponseDto> search(TransactionSpecDto specDto, Pageable pageable) {
        Specification<TransactionEntity> spec = specificationBuilder.build(specDto);
        return transactionRepository.findAll(spec, pageable).map(transactionMapper::toDto);
    }

    public TransactionEntity adminUpdateTransaction(Long transactionId, TransactionConfirmRequestDto dto) {
        TransactionEntity transaction = getById(transactionId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        checkPermission(authentication);
        TransactionState currentState = transaction.getState();
        TransactionState newState = dto.state();
        if (!transactionStateManager.isAllowedTransitionState(currentState, newState)) {
            throw new InvalidTransactionState("This state can't be set up, check state", newState);
        }
        transaction.setState(newState);
        if (dto.adminBonus() != null) {
            transaction.setAdminBonus(dto.adminBonus());
            transaction.setTotalAmount(transaction.getTotalAmount().add(dto.adminBonus()));
        }
        countDonatorsTotalDonation(newState, transaction);
        transaction.setDateApproved(LocalDateTime.now());
        transaction.setApprovedByUser(userService.getCurrentUser());
        return transactionRepository.save(transaction);
    }

    private void countDonatorsTotalDonation(TransactionState newState, TransactionEntity transaction) {
        if (newState.equals(TransactionState.COMPLETED)) {
            BigDecimal amount = transaction
                    .getDonator()
                    .getTotalDonations()
                    .add(transaction
                            .getContributionAmount());
            transaction.getDonator().setTotalDonations(amount);
        }
    }

    private void validateDonatorEmail(String donatorEmail) {
        if (!externalDonatorService.existsByEmail(donatorEmail)) {
            throw new EmailNotFoundException("Donator with the email does not exist:", donatorEmail);
        }
    }

    private TransactionEntity setTransactionFields(TransactionEntity entity, DonatorEntity donatorEntity,
                                      ServerEntity serverById, BigDecimal contributionAmount) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserEntity user) {
            entity.setCreatedByUser(user);
        } else {
            throw new UserNotFoundException("Unable to retrieve user information from Security Context.");
        }
        BigDecimal donatorBonus = serverById.getDonatorsBonuses().getOrDefault(donatorEntity, BigDecimal.ZERO);
        BigDecimal serverBonus = getServerBonus(contributionAmount, serverById);
        BigDecimal totalBonus = donatorBonus.add(serverBonus);
        BigDecimal totalAmount = getTotalAmount(contributionAmount, totalBonus);
        return entity.setDonator(donatorEntity)
                .setServer(serverById)
                .setTotalAmount(totalAmount)
                .setDonatorBonus(donatorBonus)
                .setServerBonusPercentage(serverBonus);
    }

    private BigDecimal getTotalAmount(BigDecimal incomingAmount, BigDecimal totalBonus) {
        return totalBonus.equals(BigDecimal.ZERO)
                ? incomingAmount
                : countResult(incomingAmount, totalBonus);
    }

    private BigDecimal getServerBonus(BigDecimal contributionAmount, ServerEntity serverById) {
        SortedSet<ServerBonusSettingsEntity> serverBonusSettings = serverById.getServerBonusSettings();
        ServerBonusSettingsEntity last = serverBonusSettings.last();
        if (last.getToAmount().compareTo(contributionAmount) <= 0) {
            return last.getBonusPercentage();
        }
        return serverBonusSettings.stream()
                .filter(a -> (contributionAmount.compareTo(a.getFromAmount()) >= 0
                        && contributionAmount.compareTo(a.getToAmount()) <= 0))
                .map(ServerBonusSettingsEntity::getBonusPercentage)
                .findFirst()
                .orElse(BigDecimal.ZERO);
    }

    private BigDecimal countResult(BigDecimal contributionAmount, BigDecimal totalBonus) {
        return contributionAmount.multiply(BigDecimal.ONE.add(totalBonus.divide(BigDecimal.valueOf(100.0))));
    }

    private void checkPermission(Authentication authentication) {
            authentication.getAuthorities().stream()
                    .filter(a -> a.getAuthority().equals("ADMIN"))
                    .findFirst()
                    .orElseThrow(() -> new AccessForbiddenException(
                            "Access forbidden for the current user. Admin access required"));
    }
}
