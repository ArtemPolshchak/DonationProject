package donation.main.dto.transactiondto;

import java.math.BigDecimal;

public record CreateTransactionFormDto(
        String donatorEmail,
        BigDecimal contributionAmount,
        String imageUrl,
        String comment,
        Long serverId
) { }
