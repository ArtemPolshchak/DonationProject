package donation.main.dto.serverbonusdto;

import java.math.BigDecimal;

public record ServerBonusDto(
         BigDecimal fromAmount,

         BigDecimal toAmount,

         BigDecimal bonusPercentage

) {
}
