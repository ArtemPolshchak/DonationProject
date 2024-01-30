package donation.main.dto.transactiondto;

import java.math.BigDecimal;

public record UpdateTransactionDto(
        BigDecimal contributionAmount,
        String imageUrl,
        String comment,
        Long serverId
) {
}
