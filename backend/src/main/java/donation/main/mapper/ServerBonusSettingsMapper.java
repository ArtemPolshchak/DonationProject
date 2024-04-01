package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.serverbonusdto.ServerBonusDto;
import donation.main.entity.ServerBonusSettingsEntity;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = MapperConfig.class)
public interface ServerBonusSettingsMapper {
    ServerBonusSettingsEntity toEntity(ServerBonusDto dto);

    ServerBonusDto toDto(ServerBonusSettingsEntity entity);

    ServerBonusSettingsEntity update(@MappingTarget ServerBonusSettingsEntity entity, ServerBonusDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    ServerBonusSettingsEntity partialUpdate(ServerBonusDto serverBonusesForOneServerDto, @MappingTarget ServerBonusSettingsEntity serverBonusSettingsEntity);
}
