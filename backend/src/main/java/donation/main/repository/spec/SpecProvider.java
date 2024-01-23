package donation.main.repository.spec;

import org.springframework.data.jpa.domain.Specification;

public interface SpecProvider<T> {

    String getKey();

    Specification<T> getSpecification(String[] params);
}
