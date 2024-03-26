package donation.main.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Entity
@Table(name = "donators")
@Getter
@Setter
@ToString(of = {"email", "totalDonations"})
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonatorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", unique = true, length = 32)
    private String email;

    @Column(name = "total_donations")
    @Builder.Default
    private BigDecimal totalDonations = BigDecimal.ZERO;
}
