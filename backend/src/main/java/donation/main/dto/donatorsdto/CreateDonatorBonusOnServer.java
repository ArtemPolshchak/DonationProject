package donation.main.dto.donatorsdto;

import java.math.BigDecimal;

public record CreateDonatorBonusOnServer(
        BigDecimal personalBonus
) {
}
