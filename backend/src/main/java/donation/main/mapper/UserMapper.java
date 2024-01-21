package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.userdto.UserDto;
import donation.main.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface UserMapper {

    UserEntity toEntity(UserDto userDto);

    UserDto toDto(UserEntity userEntity);

    UserEntity update(@MappingTarget UserEntity entity, UserDto userDto);

}
