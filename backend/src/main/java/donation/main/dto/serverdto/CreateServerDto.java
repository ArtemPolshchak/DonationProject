package donation.main.dto.serverdto;

public record CreateServerDto(
        String serverName,
        String serverUrl,
        String serverUserName,
        String serverPassword
) {
}
