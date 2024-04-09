package donation.main.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyJoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

@Entity
@Table(name = "servers")
@Getter
@Setter
public class ServerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "server_name", unique = true, nullable = false)
    private String serverName;

    @Column(name = "server_password", nullable = false)
    private String serverPassword;

    @Column(name = "server_url", unique = true, nullable = false)
    private String serverUrl;

    @Column(name = "server_user_name", nullable = false)
    private String serverUserName;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "servers_donators_bonuses", joinColumns = @JoinColumn(name = "server_id", referencedColumnName = "id"))
    @MapKeyJoinColumn(name = "donator_id", referencedColumnName = "id")
    @Column(name = "donators_bonuses")
    @BatchSize(size = 50)
    private Map<DonatorEntity, BigDecimal> donatorsBonuses = new HashMap<>();

    @OneToMany(mappedBy = "server", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @BatchSize(size = 50)
    private SortedSet<ServerBonusSettingsEntity> serverBonusSettings = new TreeSet<>();

    public void refreshBonuses(Set<ServerBonusSettingsEntity> set) {
        serverBonusSettings.clear();
        serverBonusSettings.addAll(set);
    }
}
