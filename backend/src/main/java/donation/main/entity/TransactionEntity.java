package donation.main.entity;

import donation.main.enumeration.TransactionState;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
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

    @ManyToOne(cascade = CascadeType.MERGE)
    private DonatorEntity donator;

    @Column(nullable = false)
    private LocalDateTime dateCreated = LocalDateTime.now();

    private LocalDateTime dateApproved;

    private String imageUrl;

    //todo set user from security context
    @ManyToOne(cascade = CascadeType.MERGE)
    private UserEntity createdByUser;

    //todo set user from security context
    @ManyToOne(cascade = CascadeType.MERGE)
    private UserEntity approvedByUser;

    @Column(name = "state", nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionState state = TransactionState.IN_PROGRESS;

    @ManyToOne
    private ServerEntity server;

    private BigDecimal contributionAmount;

    private BigDecimal totalAmount;

    private String comment;
}
