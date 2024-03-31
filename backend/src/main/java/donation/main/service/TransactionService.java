package donation.main.service;

import java.awt.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.SortedSet;
import donation.main.dto.transactiondto.CreateTransactionDto;
import donation.main.dto.transactiondto.TransactionConfirmRequestDto;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final SpecificationBuilder<TransactionEntity> specificationBuilder;
    private final TransactionMapper transactionMapper;
    private final DonatorService donatorService;
    private final ServerService serverService;
    private final TransactionStateManager transactionStateManager;
    private final UserService userService;

    @Transactional
    public TransactionResponseDto create(CreateTransactionDto dto) {
        //todo I temporoarily turn off the validation of external DB
        //donatorService.validateDonatorEmail(dto.donatorEmail());
        TransactionEntity transaction = transactionMapper.toEntity(dto);
        ServerEntity server = serverService.findById(dto.serverId());
        DonatorEntity donator = donatorService.getByEmailOrCreate(dto.donatorEmail());
        transaction = updateTransactionFields(transaction, donator, server, dto.contributionAmount());
        return transactionMapper.toDto(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponseDto updateTransaction(Long transactionId, UpdateTransactionDto dto) {
        TransactionEntity updatedTransaction = transactionMapper.update(findById(transactionId), dto);
        ServerEntity server = serverService.findById(dto.serverId());
        DonatorEntity donator = donatorService.getByEmailOrCreate(dto.donatorEmail());
        updatedTransaction = updateTransactionFields(updatedTransaction, donator, server, dto.contributionAmount());
        return transactionMapper.toDto(transactionRepository.save(updatedTransaction));
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

    public Page<TransactionResponseDto> search(TransactionSpecDto specDto, Pageable pageable) {
        Specification<TransactionEntity> spec = specificationBuilder.build(specDto);
        return transactionRepository.findAll(spec, pageable).map(transactionMapper::toDto);
    }

    public TransactionResponseDto changeState(Long id, TransactionConfirmRequestDto dto) {
        checkUserPermission();
        TransactionEntity transaction = findById(id);
        setTransactionState(transaction, dto.state());
        setTransactionAdminBonus(transaction, dto.adminBonus());
        setDonatorTotalDonation(transaction.getState(), transaction);
        transaction = transaction.toBuilder()
                .dateApproved(LocalDateTime.now())
                .approvedByUser(userService.getCurrentUser()).build();
        return transactionMapper.toDto(transactionRepository.save(transaction));
    }

    private TransactionEntity findById(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found with id: " + transactionId));
    }

    private void setTransactionAdminBonus(TransactionEntity transaction, BigDecimal adminBonus) {
        if (adminBonus != null) {
            transaction.setAdminBonus(adminBonus);
            transaction.setTotalAmount(transaction.getTotalAmount().add(adminBonus));
        }
    }

    private void setTransactionState(TransactionEntity transaction, TransactionState newState) {
        if (!transactionStateManager.isAllowedTransitionState(transaction.getState(), newState)) {
            throw new InvalidTransactionState("This state can't be set up, check state", newState);
        }
        transaction.setState(newState);
    }

    private void setDonatorTotalDonation(TransactionState newState, TransactionEntity transaction) {
        if (newState.equals(TransactionState.COMPLETED)) {
            BigDecimal amount = transaction
                    .getDonator()
                    .getTotalDonations()
                    .add(transaction.getContributionAmount());

            Integer count = transaction.getDonator().getTotalCompletedTransactions() + 1;

            transaction.getDonator().setTotalCompletedTransactions(count);
            transaction.getDonator().setTotalDonations(amount);

        }
    }

    private TransactionEntity updateTransactionFields(TransactionEntity transaction, DonatorEntity donatorEntity,
                                                      ServerEntity server, BigDecimal contributionAmount) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserEntity user) {
            transaction.setCreatedByUser(user);
        } else {
            throw new UserNotFoundException("Unable to retrieve user information from Security Context.");
        }
        BigDecimal donatorBonus = server.getDonatorsBonuses().getOrDefault(donatorEntity, BigDecimal.ZERO);
        BigDecimal serverBonus = getServerBonus(contributionAmount, server);
        BigDecimal totalBonus = donatorBonus.add(serverBonus);
        BigDecimal totalAmount = getTotalAmount(contributionAmount, totalBonus);
        return transaction.toBuilder().donator(donatorEntity)
                .server(server)
                .totalAmount(totalAmount)
                .personalBonusPercentage(donatorBonus)
                .serverBonusPercentage(serverBonus)
                .build();
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

    private void checkUserPermission() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        authentication.getAuthorities().stream()
                .filter(a -> a.getAuthority().equals("ADMIN"))
                .findFirst()
                .orElseThrow(() -> new AccessForbiddenException(
                        "Access forbidden for the current user. Admin access required"));
    }
}
