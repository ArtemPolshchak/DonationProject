package donation.main.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyJoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.commons.lang3.builder.ToStringExclude;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "servers")
@Getter
@Setter
public class ServerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    String serverName;

    String serverUrl;

    String dbUserName;

    String dbPassword;

    @ElementCollection
    @CollectionTable(name = "servers_donators_bonuses", joinColumns = @JoinColumn(name = "server_id", referencedColumnName = "id"))
    @MapKeyJoinColumn(name = "donator_id", referencedColumnName = "id")
    @Column(name = "bonus")
    private Map<DonatorEntity, BigDecimal> donatorsBonuses = new HashMap<>();

    @OneToMany(mappedBy = "server", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ServerBonusSettingsEntity> serverBonusSettings = new HashSet<>();

    public void refreshBonuses(Set<ServerBonusSettingsEntity> set) {
        serverBonusSettings.clear();
        serverBonusSettings.addAll(set);
    }
}
