package donation.main.dto.serverbonusdto;

import java.math.BigDecimal;

public record CreateServerBonusesDto(
         BigDecimal fromAmount,

         BigDecimal toAmount,

         BigDecimal bonusPercentage

) {
}
