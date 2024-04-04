package donation.main.dto.serverdto;

public record ServerDto(
        String serverName,
        String serverUrl,
        String serverUserName,
        String serverPassword
) {
}
