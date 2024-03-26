package donation.main.entity;

import static java.math.BigDecimal.ZERO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "server_bonus_settings")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ServerBonusSettingsEntity implements Comparable<ServerBonusSettingsEntity> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bonus_percentage")
    @Builder.Default
    private BigDecimal bonusPercentage = ZERO;

    @Column(name = "from_amount")
    @Builder.Default
    private BigDecimal fromAmount = ZERO;

    @Column(name = "to_amount")
    @Builder.Default
    private BigDecimal toAmount = ZERO;

    @JsonIgnoreProperties("serverBonusSettings")
    @ManyToOne
    @JoinColumn(name = "server_id")
    private ServerEntity server;

    @Override
    public int compareTo(ServerBonusSettingsEntity o) {
        return Integer.compare(this.toAmount.compareTo(o.getToAmount()), 0);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ServerBonusSettingsEntity that = (ServerBonusSettingsEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
