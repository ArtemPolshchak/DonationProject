package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.serverdto.ServerIdNameDto;

import donation.main.entity.ServerEntity;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface ServerMapper {
    ServerEntity toEntity(ServerIdNameDto serverIdNameDto);

    ServerIdNameDto toDto(ServerEntity serverEntity);

    ServerEntity update(@MappingTarget ServerEntity serverEntity, ServerIdNameDto serverIdNameDto);
}