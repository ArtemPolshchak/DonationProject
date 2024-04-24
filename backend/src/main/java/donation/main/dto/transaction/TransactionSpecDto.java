package donation.main.dto.transaction;

public record TransactionSpecDto(
        String[] serverNames,
        String[] donatorMails,
        String[] state,
        String[] paymentMethod
) {

}
