package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.transactiondto.CreateTransactionDto;
import donation.main.dto.transactiondto.TransactionResponseDto;
import donation.main.entity.TransactionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface TransactionMapper {

    TransactionEntity toEntity(CreateTransactionDto dto);

    @Mapping(source = "server.id", target = "serverId")
    @Mapping(source = "donator.email", target = "donatorEmail")
    @Mapping(source = "createdByUser.email", target = "createdBy")
    @Mapping(source = "approvedByUser.email", target = "approvedBy")
    TransactionResponseDto toDto(TransactionEntity entity);

    TransactionEntity update(@MappingTarget TransactionEntity entity, CreateTransactionDto dto);

}
