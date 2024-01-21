package donation.main.dto.donatorsdto;

import java.math.BigDecimal;

public record CreateDonatorBonusOnServer(
        Long serverId,
        String email,
        BigDecimal personalBonus
) {
}
