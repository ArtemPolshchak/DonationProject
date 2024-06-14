package donation.main.dto.transaction;

import donation.main.enumeration.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record RequestTransactionDto(
        @NotEmpty
        String donatorEmail,
        BigDecimal contributionAmount,
        String image,
        String comment,
        @NotNull
        Long serverId,
        PaymentMethod paymentMethod,
        String color
) { }
