package donation.main.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.SortedSet;
import donation.main.dto.transaction.ImageResponseDto;
import donation.main.dto.transaction.RequestTransactionDto;
import donation.main.dto.transaction.TransactionConfirmRequestDto;
import donation.main.dto.transaction.TransactionResponseDto;
import donation.main.dto.transaction.TransactionSpecDto;
import donation.main.entity.DonatorEntity;
import donation.main.entity.ServerBonusSettingsEntity;
import donation.main.entity.ServerEntity;
import donation.main.entity.TransactionEntity;
import donation.main.entity.UserEntity;
import donation.main.enumeration.TransactionState;
import donation.main.exception.AccessForbiddenException;
import donation.main.exception.InvalidTransactionState;
import donation.main.exception.TransactionNotFoundException;
import donation.main.exception.UserNotFoundException;
import donation.main.mapper.ImageMapper;
import donation.main.mapper.TransactionMapper;
import donation.main.repository.ImageRepository;
import donation.main.repository.TransactionRepository;
import donation.main.repository.spec.SpecificationBuilder;
import donation.main.security.AuthenticationService;
import donation.main.util.ImageProcessor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    private final AuthenticationService authService;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;

    @Transactional
    public TransactionResponseDto create(RequestTransactionDto dto) {
        //todo I temporoarily turn off the validation of external DB
        //donatorService.validateDonatorEmail(dto.donatorEmail());
        TransactionEntity transaction = transactionMapper.toEntity(dto);
        transaction = updateTransactionFields(transaction, dto);
        return transactionMapper.toDto(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponseDto updateTransaction(Long transactionId, RequestTransactionDto dto) {
        TransactionEntity transaction = transactionMapper.update(getById(transactionId), dto);
        transaction = updateTransactionFields(transaction, dto);
        return transactionMapper.toDto(transactionRepository.save(transaction));
    }

    public Page<TransactionResponseDto> getAll(Pageable pageable) {
        return transactionRepository.findAll(pageable).map(transactionMapper::toDto);
    }

    public TransactionEntity getById(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException("Can't find transaction by id: " + transactionId));
    }

    public Page<TransactionResponseDto> findAllTransactionsByDonatorId(Long donatorId, Pageable pageable) {
        return transactionRepository.findAllByDonatorId(donatorId, pageable).map(transactionMapper::toDto);
    }

    public Page<TransactionResponseDto> search(TransactionSpecDto specDto, Pageable pageable) {
        Specification<TransactionEntity> spec = specificationBuilder.build(specDto);
        return transactionRepository.findAll(spec, pageable).map(transactionMapper::toDto);
    }

    @Transactional(readOnly = true)
    public ImageResponseDto getImage(Long id) {
        return imageRepository.findByTransactionId(id).map(imageMapper::toDto).orElse(null);
    }

    public TransactionResponseDto changeState(Long id, TransactionConfirmRequestDto dto) {
        if (!authService.isAdmin()) {
            throw new AccessForbiddenException("Access forbidden. Admin permissions required");
        }
        TransactionEntity transaction = getById(id);
        setState(transaction, dto.state());
        setAdminBonus(transaction, dto.adminBonus());
        transaction = transaction.toBuilder()
                .dateApproved(LocalDateTime.now())
                .approvedByUser(userService.getCurrentUser()).build();
        return transactionMapper.toDto(transactionRepository.save(transaction));
    }

    private void setAdminBonus(TransactionEntity transaction, BigDecimal adminBonus) {
        if (adminBonus != null) {
            transaction.setAdminBonus(adminBonus);
            transaction.setTotalAmount(transaction.getTotalAmount().add(adminBonus));
        }
    }

    private void setState(TransactionEntity transaction, TransactionState newState) {
        if (!transactionStateManager.isAllowedTransitionState(transaction.getState(), newState)) {
            throw new InvalidTransactionState("This state can't be set up, check state", newState);
        }
        transaction.setState(newState);
    }

    private TransactionEntity updateTransactionFields(TransactionEntity transaction, RequestTransactionDto dto) {
        UserEntity user = authService.getAuthenticatedUser().orElseThrow(() ->
                new UserNotFoundException("Unable to retrieve user information from Security Context."));
        setPreviewImage(transaction, dto.image());
        ServerEntity server = serverService.findById(dto.serverId());
        DonatorEntity donator = donatorService.getByEmailOrCreate(dto.donatorEmail());
        BigDecimal donatorBonus = server.getDonatorsBonuses().getOrDefault(donator, BigDecimal.ZERO);
        BigDecimal serverBonus = getServerBonus(dto.contributionAmount(), server);
        BigDecimal totalBonus = donatorBonus.add(serverBonus);
        BigDecimal totalAmount = getTotalAmount(dto.contributionAmount(), totalBonus);
        return transaction.toBuilder().donator(donator)
                .createdByUser(user)
                .server(server)
                .totalAmount(totalAmount)
                .personalBonusPercentage(donatorBonus)
                .serverBonusPercentage(serverBonus)
                .build();
    }

    private void setPreviewImage(TransactionEntity transaction, String image) {
        if (image != null) {
            transaction.setImagePreview(ImageProcessor.resizeImage(image));
        } else {
            transaction.setImagePreview(null);
        }
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
}
