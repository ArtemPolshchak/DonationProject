package donation.main.dto.donatorsdto;

import java.math.BigDecimal;

public interface DonatorTotalDonationsView {
    Long getId();

    String getEmail();

    BigDecimal getTotalDonations();

    int getTotalCompletedTransactions();
}
