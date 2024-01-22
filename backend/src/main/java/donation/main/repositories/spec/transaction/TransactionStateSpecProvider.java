package donation.main.repositories.spec.transaction;

import donation.main.entity.TransactionEntity;
import donation.main.repositories.spec.SpecProvider;
import org.antlr.v4.runtime.atn.SemanticContext;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class TransactionStateSpecProvider implements SpecProvider<TransactionEntity> {

    @Override
    public String getKey() {
        return "state";
    }

    @Override
    public Specification<TransactionEntity> getSpecification(String[] params) {
        return (root, query, criteriaBuilder) -> params.length == 0 ? criteriaBuilder.conjunction() : root.get("state").in(Arrays.stream(params).toArray());

    }
}
