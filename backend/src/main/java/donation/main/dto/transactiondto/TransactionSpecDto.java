package donation.main.dto.transactiondto;

public record TransactionSpecDto(
        String[] serverNames,
        String[] donatorMails
) {

}
