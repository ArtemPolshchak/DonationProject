package donation.main.dto.donatorsdto;

import java.math.BigDecimal;

public record DonatorsBonusesOnServers(
        Long serverId,
        BigDecimal personalBonus
) {
}
