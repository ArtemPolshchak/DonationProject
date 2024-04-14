package donation.main.repository;

import donation.main.dto.donatorsdto.DonatorTotalDonationsView;
import donation.main.entity.TransactionEntity;
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

    @Query("SELECT t.donator AS donator, " +
            "COUNT(t.contributionAmount) AS totalCompletedTransactions , " +
            "SUM (t.contributionAmount) AS totalDonations " +
            "FROM TransactionEntity t WHERE t.donator.email LIKE LOWER(CONCAT('%', :email, '%')) " +
            "AND (:serverName IS NULL OR t.server.serverName = :serverName) " +
            "GROUP BY donator")
    Page<DonatorTotalDonationsView> findTotalDonationsByEmailLikeAndServerName(String email, String serverName, Pageable pageable);
}
