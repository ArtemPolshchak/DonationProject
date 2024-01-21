package donation.main.repositories.spec.transaction;

import donation.main.entity.TransactionEntity;
import donation.main.repositories.spec.SpecProvider;
import donation.main.repositories.spec.SpecProviderManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.NoSuchElementException;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class TransactionSpecProviderManager implements SpecProviderManager<TransactionEntity> {

    private final Set<SpecProvider<TransactionEntity>> providers;

    @Override
    public SpecProvider<TransactionEntity> getSpecProvider(String key) {
        return providers.stream()
                .filter(provider -> provider.getKey().equals(key))
                .findFirst()
                .orElseThrow(NoSuchElementException::new);
    }
}
