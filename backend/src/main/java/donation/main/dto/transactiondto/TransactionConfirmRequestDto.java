package donation.main.dto.transactiondto;

import java.math.BigDecimal;
import donation.main.enumeration.TransactionState;

public record TransactionConfirmRequestDto(
        TransactionState state,
        BigDecimal adminBonus
) {
}
