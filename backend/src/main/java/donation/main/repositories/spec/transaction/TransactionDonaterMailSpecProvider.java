package donation.main.repositories.spec.transaction;

import donation.main.entity.TransactionEntity;
import donation.main.repositories.spec.SpecProvider;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class TransactionDonaterMailSpecProvider implements SpecProvider<TransactionEntity> {

    @Override
    public String getKey() {
        return "donatorMails";
    }

    @Override
    public Specification<TransactionEntity> getSpecification(String[] params) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            for (String param : params) {
                String pattern = "%" + param.toLowerCase() + "%";
                Expression<String> mailToLowerCase = criteriaBuilder.lower(root.get("donator").get("email"));
                predicate = criteriaBuilder
                       .and(predicate, criteriaBuilder.like(mailToLowerCase, pattern));
            }
            return predicate;
        };

    }
}
