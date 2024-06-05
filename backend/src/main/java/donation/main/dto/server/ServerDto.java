package donation.main.dto.server;

public record ServerDto(
        String serverName,
        String serverUrl,
        String serverUserName,
        String serverPassword,
        Integer serverId,
        String publicKey,
        String secretKey) {
}
