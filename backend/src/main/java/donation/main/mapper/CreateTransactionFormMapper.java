package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.transactiondto.CreateTransactionFormDto;
import donation.main.entity.TransactionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface CreateTransactionFormMapper {

    TransactionEntity toEntity(CreateTransactionFormDto formDto);

    CreateTransactionFormDto toDto(TransactionEntity entity);

    TransactionEntity update(@MappingTarget TransactionEntity entity, CreateTransactionFormDto formDto);

}
