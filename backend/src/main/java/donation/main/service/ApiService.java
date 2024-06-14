package donation.main.service;
import reactor.core.publisher.Mono;

public interface ApiService {

    String getMd5(String data);

    Mono<String> getBalance(String email, int serverId);

    Mono<String> updateBalance(String email, int value);

    Mono<String> getDonator(String email);

    Mono<Boolean> existsByEmail(String email);
}
