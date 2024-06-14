package donation.main.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import donation.main.service.ApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.math.BigInteger;
import java.security.MessageDigest;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;

@Service
@RequiredArgsConstructor
public class ApiServiceImpl implements ApiService {

    // @Value("${external.api.url}")
    private String externalApiUrl = "https://api.mmoweb.biz/v1/Control";

    // @Value("${mmoweb.public.key}")
    private String publicKey = "4BC8ABRA";

    // @Value("${mmoweb.secret.key}")
    private String secretKey = "ypgKVtKBI8G4sxDZcDom";

    // @Value("${mmoweb.server.id}")
    private int serverId = 786;

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

    public Mono<Boolean> existsByEmail(String email) {
        String hash = getMd5("{\"email\":\"" + email
                + "\",\"public_key\":\"" + publicKey
                + "\"}" + secretKey);

        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("public_key", publicKey);
        queryParams.add("email", email);
        queryParams.add("hash", hash);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("api.mmoweb.biz")
                        .path("/v1/Control/users/balance")
                        .queryParams(queryParams)
                        .build())
                .retrieve()
                .toBodilessEntity()
                .map(response -> true)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    if (ex.getStatusCode() == HttpStatus.LOCKED) {
                        return Mono.just(false);
                    }
                    return Mono.error(ex);
                });
    }

    @Override
    public Mono<String> getBalance(String email, int serverId) {
        String hash;
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("public_key", publicKey);
        queryParams.add("email", email);

        if (serverId > 0) {
            hash = getMd5("{\"email\":\"" + email
                    + "\",\"public_key\":\"" + publicKey
                    + "\",\"sid\":\"" + serverId + "\"}" + secretKey);
            queryParams.add("sid", String.valueOf(serverId));
        } else {
            hash = getMd5("{\"email\":\"" + email
                    + "\",\"public_key\":\"" + publicKey + "\"}" + secretKey);
        }
        queryParams.add("hash", hash);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("api.mmoweb.biz")
                        .path("/v1/Control/users/balance")
                        .queryParams(queryParams)
                        .build())
                .retrieve()
                .bodyToMono(String.class);
    }

    /*@Override
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

    }*/


/*    public Mono<String> getGeneralBalance(String email) {
        String hash = getMd5("{\"email\":\"" + email + "\",\"public_key\":\"" + publicKey + "\"}" + secretKey);

        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("public_key", publicKey);
        queryParams.add("email", email);
        queryParams.add("hash", hash);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")  // Убедитесь, что схема указана верно
                        .host("api.mmoweb.biz")  // Убедитесь, что хост указан верно
                        .path("/v1/Control/users/balance")
                        .queryParams(queryParams)
                        .build())
                .retrieve()
                .bodyToMono(String.class);
    }*/

    @Override
    public Mono<String> updateBalance(String email, int value) {
        String hash = getMd5("{\"email\":\"" + email
                + "\",\"public_key\":\"" + publicKey
                + "\",\"sid\":\"" + serverId
                + "\",\"value\":\"" + value + "\"}" + secretKey);

        String url = externalApiUrl + "/users/update-balance";

        MultiValueMap<String, String> bodyValues = new LinkedMultiValueMap<>();

        bodyValues.add("email", email);
        bodyValues.add("public_key", publicKey);
        bodyValues.add("sid", String.valueOf(serverId));
        bodyValues.add("value", String.valueOf(value));
        bodyValues.add("hash", hash);

        return webClient.post()
                .uri(url)
                .body(BodyInserters.fromFormData(bodyValues))
                .retrieve().bodyToMono(String.class);
    }

    @Override
    public Mono<String> getDonator(String email) {
        String hash = getMd5("{\"email\":\"" + email + "\",\"public_key\":\"" + publicKey + "\"}" + secretKey);

        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("public_key", publicKey);
        queryParams.add("email", email);
        queryParams.add("hash", hash);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")  // Убедитесь, что схема указана верно
                        .host("api.mmoweb.biz")  // Убедитесь, что хост указан верно
                        .path("/v1/Control/users/get")
                        .queryParams(queryParams)
                        .build())
                .retrieve()
                .bodyToMono(String.class);
    }

    public void fetchAndLogBalance(String email) {
        getBalance(email, serverId).subscribe(
                balance -> System.out.println("Полученный баланс: " + balance),
                error -> System.err.println("Ошибка при получении баланса: " + error)
        );
    }
}
