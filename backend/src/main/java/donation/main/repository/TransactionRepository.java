package donation.main.repository;

import java.util.List;
import java.util.Optional;
import donation.main.dto.transactiondto.TransactionImageView;
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
    @EntityGraph(attributePaths = {"approvedByUser", "createdByUser", "donator", "server"})
    Page<TransactionEntity> findAllByState(TransactionState state, Pageable pageable);

    @Query("FROM TransactionEntity t WHERE t.donator.id = :donatorId AND t.state = 'COMPLETED'")
    Page<TransactionEntity> findAllByDonatorId(Long donatorId, Pageable pageable);

    @EntityGraph(attributePaths = {"approvedByUser", "createdByUser", "donator", "server"})
    List<TransactionEntity> findAllByIdIn(List<Long> ids);

    @Query("SELECT t.image as image FROM TransactionEntity t WHERE t.id = :id")
    Optional<TransactionImageView> findImageByTransactionId(Long id);

    @Query("SELECT id FROM TransactionEntity")
    Page<Long> findAllIds(Specification<TransactionEntity> spec, Pageable pageable);
}
