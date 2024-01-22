package donation.main.dto.transactiondto;

import java.math.BigDecimal;

public record CreateTransactionDto(
        String donatorEmail,
        BigDecimal contributionAmount,
        String imageUrl,
        String comment,
        Long serverId
) { }
