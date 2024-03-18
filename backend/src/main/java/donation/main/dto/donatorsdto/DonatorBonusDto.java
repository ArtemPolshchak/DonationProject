package donation.main.dto.donatorsdto;

import java.math.BigDecimal;

public record DonatorBonusDto(
        Long id,
        String email,
        BigDecimal personalBonus
) {
}
