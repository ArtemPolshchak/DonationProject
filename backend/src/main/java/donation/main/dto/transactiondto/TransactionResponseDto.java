package donation.main.dto.transactiondto;

import java.math.BigDecimal;
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
        BigDecimal contributionAmount,
        BigDecimal totalAmount,
        String comment,
        String color
) {
}
