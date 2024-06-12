package donation.main.service.impl;

import donation.main.service.ApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.math.BigInteger;
import java.security.MessageDigest;

@Service
@RequiredArgsConstructor
public class ApiServiceImpl implements ApiService {

    private String externalApiUrl = "";

    private String publicKey = "";

    private String secretKey = "";

    private int serverId = 0;

    private final WebClient webClient;

    @Override
    public String getMd5(String data) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(data.getBytes());
            String md5Hex = new BigInteger(1, digest).toString(16);

            while (md5Hex.length() < 32) {
                md5Hex = "0" + md5Hex;
            }
            return md5Hex;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Mono<String> getBalance(String email) {
        String hash = getMd5("{\"email\":\"" + email
                + "\",\"public_key\":\"" + publicKey
                + "\",\"sid\":\"" + serverId + "\"}"
                + secretKey);
        String url = externalApiUrl + "/users/balance?public_key=" + publicKey
                + "&email=" + email
                + "&sid=" + serverId
                + "&hash=" + hash;

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class);

    }

    @Override
    public Mono<String> updateBalance(String email, int value) {
        String hash = getMd5("{\"email\":\"" + email
                + "\",\"public_key\":\"" + publicKey
                + "\",\"sid\":\"" + serverId
                + "\",\"value\":\"" + value + "\"}" + secretKey);

        String url = externalApiUrl + "/users/update-balance";
        String requestBody = "sid=" + serverId +"&public_key=" + publicKey
                + "&email=" + email +  "&value="
                + value + "&hash=" + hash;
        return webClient.post()
                .uri(url)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class);
    }

    public void fetchAndLogBalance(String email) {
        getBalance(email).subscribe(
                balance -> System.out.println("Полученный баланс: " + balance),
                error -> System.err.println("Ошибка при получении баланса: " + error)
        );
    }
}
