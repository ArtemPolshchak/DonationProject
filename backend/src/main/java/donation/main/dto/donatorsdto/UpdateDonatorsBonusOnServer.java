package donation.main.dto.donatorsdto;

import java.math.BigDecimal;

public record UpdateDonatorsBonusOnServer(
        Long serverId,
        Long donatorId,
        BigDecimal personalBonus
) {
}
