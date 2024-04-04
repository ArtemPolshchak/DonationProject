package donation.main.repository.spec.transaction;

import donation.main.entity.TransactionEntity;
import donation.main.repository.spec.SpecProvider;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class TransactionPaymentMethodSpecProvider implements SpecProvider<TransactionEntity> {

    @Override
    public String getKey() {
        return "paymentMethod";
    }

    @Override
    public Specification<TransactionEntity> getSpecification(String[] params) {
        return (root, query, criteriaBuilder) -> params.length == 0
                ? criteriaBuilder.conjunction()
                : root.get("paymentMethod").in(Arrays.stream(params).toArray());
    }
}
