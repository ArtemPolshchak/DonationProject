package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.donatorsdto.CreateDotatorDto;
import donation.main.entity.DonatorEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface CreateDonatorMapper {
    DonatorEntity toEntity(CreateDotatorDto dotatorDto);

    CreateDotatorDto toDto(DonatorEntity entity);

    DonatorEntity update(@MappingTarget DonatorEntity entity, CreateDotatorDto dotatorDto);

}
