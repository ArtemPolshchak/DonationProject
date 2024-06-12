package donation.main.service;
import reactor.core.publisher.Mono;

public interface ApiService {

    String getMd5(String data);

    Mono<String> getBalance(String email);

    Mono<String> updateBalance(String email, int value);
}
