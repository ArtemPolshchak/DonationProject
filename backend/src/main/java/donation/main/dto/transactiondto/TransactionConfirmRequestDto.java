package donation.main.dto.transactiondto;

import java.math.BigDecimal;

public record TransactionConfirmRequestDto(
        String state,
        BigDecimal adminBonus
) {
}
