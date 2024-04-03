package donation.main.repository;

import donation.main.entity.TransactionEntity;
import donation.main.enumeration.TransactionState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long>, JpaSpecificationExecutor<TransactionEntity> {
    @Query("FROM TransactionEntity t WHERE t.donator.id = :donatorId AND t.state = 'COMPLETED'")
    Page<TransactionEntity> findAllByDonatorId(Long donatorId, Pageable pageable);

    @NonNull
    @EntityGraph(attributePaths = {"approvedByUser", "createdByUser", "donator", "server"})
    Page<TransactionEntity> findAll(@NonNull Specification<TransactionEntity> spec, @NonNull Pageable pageable);
}
