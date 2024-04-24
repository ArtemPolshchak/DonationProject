package donation.main.dto.donator;

import java.math.BigDecimal;

public record DonatorBonusOnServer(
        Long serverId,
        String serverName,
        BigDecimal personalBonus
) {
}
