package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.transactiondto.CreateTransactionDto;
import donation.main.dto.transactiondto.TransactionConfirmRequestDto;
import donation.main.dto.transactiondto.TransactionResponseDto;
import donation.main.dto.transactiondto.UpdateTransactionDto;
import donation.main.entity.ImageEntity;
import donation.main.entity.TransactionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.awt.*;

@Mapper(config = MapperConfig.class, uses = ImageMapper.class, imports = Color.class)
public interface TransactionMapper {

    @Mapping(target = "color", expression = "java(Color.decode(dto.color()))")
    TransactionEntity toEntity(CreateTransactionDto dto);

    @Mapping(source = "server.serverName", target = "serverName")
    @Mapping(source = "donator.email", target = "donatorEmail")
    @Mapping(source = "createdByUser.username", target = "createdBy")
    @Mapping(source = "approvedByUser.username", target = "approvedBy")
    TransactionResponseDto toDto(TransactionEntity entity);

    @Mapping(target = "color", expression = "java(Color.decode(dto.color()))")
    @Mapping(target = "image", expression = "java(imageMapper.update(entity.getImage(), dto.image()))")
    TransactionEntity update(@MappingTarget TransactionEntity entity, UpdateTransactionDto dto);

    default String convertColorToHexString(Color color) {
        String hex = Integer.toHexString(color.getRGB() & 0xffffff);
        if (hex.length() < 6) {
            hex = "0" + hex;
        }
        return "#" + hex;
    }
}
