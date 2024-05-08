package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.user.UserCreateRequestDto;
import donation.main.dto.auth.LoginRequestDto;
import donation.main.dto.user.UserResponseDto;
import donation.main.dto.user.UserUpdateRequestDto;
import donation.main.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface UserMapper {
    UserEntity toEntity(UserCreateRequestDto dto);

    UserEntity update(@MappingTarget UserEntity entity, UserUpdateRequestDto dto);

    UserEntity toEntity(LoginRequestDto dto);

    @Mapping(target = "isTfaActive", source = "tfaActive")
    UserResponseDto toDto(UserEntity entity);
}
