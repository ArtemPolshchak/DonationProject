package donation.main.dto.donatorsdto;

import java.math.BigDecimal;

public record UpdateDonatorsBonusOnServer(
        BigDecimal personalBonus
) {
}
