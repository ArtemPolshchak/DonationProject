package donation.main.dto.transactiondto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CreateTransactionDto(
        @NotEmpty
        String donatorEmail,
        @DecimalMin("1")
        BigDecimal contributionAmount,
        String image,
        String comment,
        @NotNull
        Long serverId,
        String color
) { }
