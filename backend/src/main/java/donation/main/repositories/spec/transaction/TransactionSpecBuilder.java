package donation.main.repositories.spec.transaction;

import donation.main.entity.TransactionEntity;
import donation.main.repositories.spec.SpecProvider;
import donation.main.repositories.spec.SpecProviderManager;
import donation.main.repositories.spec.SpecificationBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;

@Component
@RequiredArgsConstructor
public class TransactionSpecBuilder implements SpecificationBuilder<TransactionEntity> {

    private final SpecProviderManager<TransactionEntity> specProviderManager;

    @Override
    public Specification<TransactionEntity> build(Record recordDto) {
        Specification<TransactionEntity> spec = Specification.where(null);

        for (Field declaredField : recordDto.getClass().getDeclaredFields()) {
            declaredField.setAccessible(true);
            try {
                if (declaredField.get(recordDto) != null) {
                    SpecProvider<TransactionEntity> specProvider = specProviderManager.getSpecProvider(declaredField.getName());
                    spec = spec.and(specProvider.getSpecification((String[]) declaredField.get(recordDto)));
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
        return spec;
    }
}
