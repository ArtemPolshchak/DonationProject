package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.donator.CreateDonatorBonusOnServer;
import donation.main.dto.donator.CreateDonatorDto;
import donation.main.entity.DonatorEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface DonatorMapper {
    DonatorEntity toEntity(CreateDonatorDto dto);

    DonatorEntity toEntity(CreateDonatorBonusOnServer dto);

    CreateDonatorDto toDto(DonatorEntity entity);

    DonatorEntity update(@MappingTarget DonatorEntity entity, CreateDonatorDto dto);
}
