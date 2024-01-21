package donation.main.repositories.spec.transaction;

import donation.main.entity.TransactionEntity;
import donation.main.repositories.spec.SpecProvider;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class TransactionServerNameSpecProvider implements SpecProvider<TransactionEntity> {
    @Override
    public String getKey() {
        return "serverNames";
    }

    @Override
    public Specification<TransactionEntity> getSpecification(String[] params) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lower(root.get("server").get("serverName"))
                        .in(Arrays.stream(params).map(String::toLowerCase).toArray());
    }
}
