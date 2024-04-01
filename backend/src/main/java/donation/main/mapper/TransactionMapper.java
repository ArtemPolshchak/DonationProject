package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.transactiondto.CreateTransactionDto;
import donation.main.dto.transactiondto.TransactionResponseDto;
import donation.main.dto.transactiondto.UpdateTransactionDto;
import donation.main.entity.TransactionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.awt.*;

@Mapper(config = MapperConfig.class, imports = Color.class)
public interface TransactionMapper {

    TransactionEntity toEntity(CreateTransactionDto dto);

    @Mapping(source = "server.serverName", target = "serverName")
    @Mapping(source = "donator.email", target = "donatorEmail")
    @Mapping(source = "createdByUser.username", target = "createdBy")
    @Mapping(source = "approvedByUser.username", target = "approvedBy")
    TransactionResponseDto toDto(TransactionEntity entity);

    @Mapping(target = "color", expression = "java(Color.decode(dto.color()))")
    TransactionEntity update(@MappingTarget TransactionEntity entity, UpdateTransactionDto dto);

    default byte[] imageBase64ToByteArray(String image) {
        return image == null ? null : image.getBytes();
    }

    default String imageByteArrayToBase64(byte[] image) {
        return new String(image);
    }

    default String convertHexToString(Color color) {
        String hex = Integer.toHexString(color.getRGB() & 0xffffff);
        if (hex.length() < 6) {
            hex = "0" + hex;
        }
        return "#" + hex;
    }
}
