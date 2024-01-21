package donation.main.repositories.spec;

import org.springframework.data.jpa.domain.Specification;

public interface SpecificationBuilder<T> {

    Specification<T> build(Record recordDto);

}
