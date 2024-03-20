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

    @Mapping(target = "image", expression = "java(dto.image() == null ? null : dto.image().getBytes())")
    TransactionEntity toEntity(CreateTransactionDto dto);

    @Mapping(source = "server.serverName", target = "serverName")
    @Mapping(source = "donator.email", target = "donatorEmail")
    @Mapping(source = "createdByUser.email", target = "createdBy")
    @Mapping(source = "approvedByUser.email", target = "approvedBy")
    @Mapping(target = "image", expression = "java(entity.getImage() == null ? null : new String(entity.getImage()))")
    TransactionResponseDto toDto(TransactionEntity entity);

    @Mapping(target = "image", expression = "java(dto.image() == null ? null : dto.image().getBytes())")
    TransactionEntity update(@MappingTarget TransactionEntity entity, UpdateTransactionDto dto);

}
