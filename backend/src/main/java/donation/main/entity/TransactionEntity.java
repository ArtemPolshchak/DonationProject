package donation.main.entity;

import static java.math.BigDecimal.ZERO;

import donation.main.enumeration.PaymentMethod;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.awt.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import donation.main.enumeration.TransactionState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SoftDelete;
import org.hibernate.annotations.SoftDeleteType;
import org.hibernate.type.TrueFalseConverter;

@Entity
@Table(name = "transactions")
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@SoftDelete(strategy = SoftDeleteType.DELETED, converter = TrueFalseConverter.class)
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
    private LocalDateTime dateCreated = LocalDateTime.now(ZoneId.of("Europe/Kiev"));

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private ImageEntity image;

    @Lob
    @Column(name = "image_preview")
    private byte[] imagePreview;

    @Column(name = "state", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TransactionState state = TransactionState.IN_PROGRESS;

    @Column(name = "payment_method", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.PAYPAL;

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
    @ManyToOne
    @JoinColumn(name = "approved_by_user_id")
    private UserEntity approvedByUser;

    //todo set user from security context
    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private UserEntity createdByUser;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "donator_id")
    private DonatorEntity donator;

    @ManyToOne
    @JoinColumn(name = "server_id")
    private ServerEntity server;

    @Column(name = "color")
    @Builder.Default
    private Color color = Color.decode("#f5f5f5");

    @Override
    public String toString() {
        return dateCreated.format(DateTimeFormatter.ofPattern("HH:mm MM.dd.yyyy"))
                + System.lineSeparator()
                + "Server: " + server.getServerName()
                + System.lineSeparator()
                + "Donator email: " + donator.getEmail()
                + System.lineSeparator()
                + "Payment system: " + paymentMethod
                + System.lineSeparator()
                + "Contribution amount: " + contributionAmount;
    }
}
