package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.transactiondto.CreateTransactionDto;
import donation.main.dto.transactiondto.TransactionResponseDto;
import donation.main.dto.transactiondto.UpdateTransactionDto;
import donation.main.entity.TransactionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface TransactionMapper {

    TransactionEntity toEntity(CreateTransactionDto dto);

    @Mapping(source = "server.serverName", target = "serverName")
    @Mapping(source = "donator.email", target = "donatorEmail")
    @Mapping(source = "createdByUser.email", target = "createdBy")
    @Mapping(source = "approvedByUser.email", target = "approvedBy")
    TransactionResponseDto toDto(TransactionEntity entity);

    @Mapping(target = "image", expression = "java(imageBase64ToByteArray(dto.image()))")
    TransactionEntity update(@MappingTarget TransactionEntity entity, UpdateTransactionDto dto);

    default byte[] imageBase64ToByteArray(String image) {
        return image == null ? null : image.getBytes();
    }

    default String imageByteArrayToBase64(byte[] image) {
        return new String(image);
    }
}
