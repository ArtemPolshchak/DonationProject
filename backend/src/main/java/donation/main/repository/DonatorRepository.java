package donation.main.repository;

import java.util.Optional;
import donation.main.dto.donatorsdto.DonatorTotalDonationsView;
import donation.main.entity.DonatorEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;

public interface DonatorRepository extends JpaRepository<DonatorEntity, Long> {

    Optional<DonatorEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<DonatorEntity> findByEmailContainingIgnoreCase(String email, Pageable pageable);

    @Query(nativeQuery = true, value =
            "SELECT id, email, totalCompletedTransactions, COALESCE(sum, 0) as totalDonations "
                    + "FROM (SELECT d.id AS id, d.email AS email,  "
                    + "COUNT(t.contribution_amount) AS totalCompletedTransactions , "
                    + "SUM(t.contribution_amount) AS sum "
                    + "FROM donators AS d "
                    + "LEFT JOIN transactions AS t ON t.donator_id = d.id "
                    + "WHERE d.email LIKE LOWER(CONCAT('%', :email, '%')) "
                    + "AND (:serverId IS NULL OR t.server_id = :serverId) "
                    + "AND (t.state LIKE 'COMPLETED') "
                    + "GROUP BY d.id) AS sub",
            countQuery = "SELECT COUNT(1) FROM donators as d "
                    + "LEFT JOIN transactions AS t ON t.donator_id = d.id "
                    + "WHERE d.email LIKE LOWER(CONCAT('%', :email, '%')) "
                    + "AND (:serverId IS NULL OR t.server_id = :serverId) "
                    + "GROUP BY d.id")
    Page<DonatorTotalDonationsView> findTotalDonationsByEmailLikeAndServerName(String email, Long serverId, Pageable pageable);
}