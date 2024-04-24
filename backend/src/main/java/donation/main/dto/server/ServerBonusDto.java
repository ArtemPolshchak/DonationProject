package donation.main.dto.server;

import java.math.BigDecimal;

public record ServerBonusDto(
         BigDecimal fromAmount,

         BigDecimal toAmount,

         BigDecimal bonusPercentage

) {
}
