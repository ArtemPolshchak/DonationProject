package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.server.ServerDto;
import donation.main.dto.server.ServerIdNameDto;
import donation.main.entity.ServerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface ServerMapper {

    ServerEntity toEntity(ServerDto dto);

    ServerEntity update(@MappingTarget ServerEntity entity, ServerDto dto);

    @Mapping(source = "serverName", target = "serverName")
    @Mapping(source = "serverUrl", target = "serverUrl")
    @Mapping(source = "serverUserName", target = "serverUserName")
    @Mapping(source = "serverPassword", target = "serverPassword")
    @Mapping(source = "serverId", target = "serverId")
    @Mapping(source = "publicKey", target = "publicKey")
    @Mapping(source = "secretKey", target = "secretKey")
    ServerDto toDto(ServerDto entity);

    ServerEntity toEntity(ServerIdNameDto dto);

    ServerIdNameDto toDto(ServerEntity entity);

}
