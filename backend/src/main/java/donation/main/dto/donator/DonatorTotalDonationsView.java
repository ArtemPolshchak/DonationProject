package donation.main.dto.donator;

import java.math.BigDecimal;

public interface DonatorTotalDonationsView {
    Long getId();

    String getEmail();

    BigDecimal getTotalDonations();

    int getTotalCompletedTransactions();
}
