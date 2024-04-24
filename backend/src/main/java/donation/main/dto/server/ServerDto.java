package donation.main.dto.server;

public record ServerDto(
        String serverName,
        String serverUrl,
        String serverUserName,
        String serverPassword,
        String publicKey,
        String secretKey) {
}
