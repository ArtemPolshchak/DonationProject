package donation.main.dto.donatorsdto;

import java.math.BigDecimal;

public record DonatorBonusOnServer(
        Long serverId,
        BigDecimal personalBonus
) {
}
