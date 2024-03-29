package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.serverdto.CreateServerDto;
import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.ServerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface ServerMapper {

    ServerEntity toEntity(CreateServerDto dto);

    ServerEntity update(@MappingTarget ServerEntity entity, CreateServerDto dto);

    ServerEntity toEntity(ServerIdNameDto dto);

    ServerIdNameDto toDto(ServerEntity entity);

    ServerEntity update(@MappingTarget ServerEntity entity, ServerIdNameDto dto);

}
