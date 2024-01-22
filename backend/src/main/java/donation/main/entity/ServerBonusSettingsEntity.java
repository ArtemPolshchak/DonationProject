package donation.main.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.commons.lang3.builder.ToStringExclude;


import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "server_bonus_settings")
@Getter
@Setter
public class ServerBonusSettingsEntity implements Comparable<ServerBonusSettingsEntity> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal fromAmount;

    private BigDecimal toAmount;

    private BigDecimal bonusPercentage;

    @JsonIgnoreProperties("serverBonusSettings")
    @ManyToOne
    private ServerEntity server;

    @Override
    public int compareTo(ServerBonusSettingsEntity o) {
        return Integer.compare(this.toAmount.compareTo(o.getToAmount()), 0);
    }


//    @Override
//    public boolean equals(Object o) {
//        if (this == o) {
//            return true;
//        }
//        if (o == null || getClass() != o.getClass()) {
//            return false;
//        }
//        ServerBonusSettingsEntity that = (ServerBonusSettingsEntity) o;
//        return Objects.equals(id, that.id);
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(id);
//    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ServerBonusSettingsEntity that = (ServerBonusSettingsEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
