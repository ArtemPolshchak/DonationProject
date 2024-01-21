package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.serverbonusdto.CreateServerBonusesDto;
import donation.main.entity.ServerBonusSettingsEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface ServerBonusSettingsMapper {
    ServerBonusSettingsEntity toEntity(CreateServerBonusesDto serverBonusesDto);

    CreateServerBonusesDto toDto(ServerBonusSettingsEntity entity);

    ServerBonusSettingsEntity update(@MappingTarget ServerBonusSettingsEntity entity, CreateServerBonusesDto dto);
}
