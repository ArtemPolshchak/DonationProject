package donation.main.entity;

import static java.math.BigDecimal.ZERO;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import donation.main.enumeration.TransactionState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "transactions")
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TransactionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comment")
    private String comment;

    @Column(name = "contribution_amount")
    private BigDecimal contributionAmount;

    @Column(name = "date_approved")
    private LocalDateTime dateApproved;

    @Column(name = "date_created", nullable = false)
    @Builder.Default
    private LocalDateTime dateCreated = LocalDateTime.now();

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "state", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TransactionState state = TransactionState.IN_PROGRESS;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "server_bonus_percentage")
    @Builder.Default
    private BigDecimal serverBonusPercentage = ZERO;

    @Column(name = "donator_bonus_percentage")
    @Builder.Default
    private BigDecimal personalBonusPercentage = ZERO;

    @Column(name = "admin_bonus")
    @Builder.Default
    private BigDecimal adminBonus = ZERO;

    //todo set user from security context
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "approved_by_user_id")
    private UserEntity approvedByUser;

    //todo set user from security context
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "created_by_user_id")
    private UserEntity createdByUser;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "donator_id")
    private DonatorEntity donator;

    @ManyToOne
    @JoinColumn(name = "server_id")
    private ServerEntity server;
}
