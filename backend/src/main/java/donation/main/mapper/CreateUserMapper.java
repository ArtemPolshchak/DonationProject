package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.userdto.CreateUserDto;
import donation.main.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface CreateUserMapper {
    UserEntity toEntity(CreateUserDto userDto);

    CreateUserDto toDto(UserEntity userEntity);

    UserEntity update(@MappingTarget UserEntity entity, CreateUserDto userDto);
}
