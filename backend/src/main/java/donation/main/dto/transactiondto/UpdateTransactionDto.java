package donation.main.dto.transactiondto;

import java.math.BigDecimal;

public record UpdateTransactionDto(
        BigDecimal contributionAmount,
        String image,
        String comment,
        Long serverId

) {
}
