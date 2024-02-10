package donation.main.dto;

import java.math.BigDecimal;

public record TransactionConfirmRequestDto(
        String state,
        BigDecimal adminBonus
) {
}
