package donation.main.dto.donatorsdto;

import java.math.BigDecimal;
import donation.main.entity.DonatorEntity;

public interface DonatorTotalDonationsView {
    DonatorEntity getDonator();

    BigDecimal getTotalDonations();

    int getTotalCompletedTransactions();
}
