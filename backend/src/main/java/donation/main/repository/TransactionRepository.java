package donation.main.repository;

import donation.main.entity.TransactionEntity;
import donation.main.enumeration.TransactionState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long>, JpaSpecificationExecutor<TransactionEntity> {
    //PagingAndSortingRepository<TransactionEntity, Long>
    Page<TransactionEntity> findAllByState(TransactionState state, Pageable pageable);

    @Query("SELECT t FROM TransactionEntity t WHERE t.donator.id = :donatorId AND t.state = 'COMPLETED'")
    Page<TransactionEntity> findAllByDonatorId(Long donatorId, Pageable pageable);

}
