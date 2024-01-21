package donation.main.dto.donatorsdto;

import java.math.BigDecimal;

public record CreateDotatorDto(
        String mail,
        BigDecimal personalBonus
) {
}
