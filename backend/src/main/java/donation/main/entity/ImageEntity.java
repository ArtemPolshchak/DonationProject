package donation.main.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "images")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageEntity {
    @Lob
    byte[] data;
    @OneToOne(mappedBy = "image")
    private TransactionEntity transaction;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
