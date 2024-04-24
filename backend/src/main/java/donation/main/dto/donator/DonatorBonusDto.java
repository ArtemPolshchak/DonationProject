package donation.main.dto.donator;

import java.math.BigDecimal;

public record DonatorBonusDto(
        Long id,
        String email,
        BigDecimal personalBonus
) {
}
