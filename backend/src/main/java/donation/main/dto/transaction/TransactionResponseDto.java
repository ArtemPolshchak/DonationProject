package donation.main.dto.transaction;

import java.math.BigDecimal;

import donation.main.enumeration.PaymentMethod;
import donation.main.enumeration.TransactionState;

public record TransactionResponseDto(
        Long id,
        String donatorEmail,
        String serverName,
        String dateCreated,
        int serverBonusPercentage,
        int personalBonusPercentage,
        int adminBonus,
        String dateApproved,
        String imagePreview,
        String createdBy,
        String approvedBy,
        TransactionState state,
        PaymentMethod paymentMethod,
        BigDecimal contributionAmount,
        BigDecimal totalAmount,
        String comment,
        String color
) {
}
