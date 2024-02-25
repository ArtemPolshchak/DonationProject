package donation.main.entity;

import static java.math.BigDecimal.ZERO;

import donation.main.enumeration.TransactionState;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
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
    private LocalDateTime dateCreated = LocalDateTime.now();

    @Column(name = "image")
    private String imageUrl;

    @Column(name = "state", nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionState state = TransactionState.IN_PROGRESS;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "server_bonus_percentage")
    private BigDecimal serverBonusPercentage = ZERO;

    @Column(name = "donator_bonus_percentage")
    private BigDecimal personalBonusPercentage = ZERO;

    @Column(name = "admin_bonus")
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

    public TransactionEntity setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
        return this;
    }

    public TransactionEntity setServerBonusPercentage(BigDecimal serverBonus) {
        this.serverBonusPercentage = serverBonus;
        return this;
    }

    public TransactionEntity setDonatorBonus(BigDecimal donatorBonusPercentage) {
        this.personalBonusPercentage = donatorBonusPercentage;
        return this;
    }

    public TransactionEntity setDonator(DonatorEntity donator) {
        this.donator = donator;
        return this;
    }

    public TransactionEntity setServer(ServerEntity server) {
        this.server = server;
        return this;
    }
}
