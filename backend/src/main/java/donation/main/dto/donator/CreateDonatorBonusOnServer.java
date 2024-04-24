package donation.main.dto.donator;

import java.math.BigDecimal;

public record CreateDonatorBonusOnServer(
        BigDecimal personalBonus
) {
}
