package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.serverdto.CreateServerDto;
import donation.main.dto.serverdto.ServerIdNameDto;
import donation.main.entity.ServerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface CreateServerMapper {

    ServerEntity toEntity(CreateServerDto serverDto);

    CreateServerDto toCreateDto(ServerEntity serverEntity);

    ServerEntity update(@MappingTarget ServerEntity entity, CreateServerDto serverDto);

}
