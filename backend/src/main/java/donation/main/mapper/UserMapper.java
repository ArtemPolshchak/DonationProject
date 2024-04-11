package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.userdto.UserCreateRequestDto;
import donation.main.dto.userdto.SignInRequestDto;
import donation.main.dto.userdto.UserResponseDto;
import donation.main.dto.userdto.UserUpdateRequestDto;
import donation.main.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface UserMapper {
    UserEntity toEntity(UserCreateRequestDto dto);

    UserEntity update(@MappingTarget UserEntity entity, UserUpdateRequestDto dto);

    UserEntity toEntity(SignInRequestDto dto);

    UserResponseDto toDto(UserEntity entity);
}
