package donation.main.mapper;

import donation.main.config.MapperConfig;
import donation.main.dto.userdto.SignInRequestDto;
import donation.main.dto.userdto.SignUpRequestDto;
import donation.main.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(config = MapperConfig.class)
public interface UserMapper {
    UserEntity toEntity(SignUpRequestDto userDto);

    SignUpRequestDto createUserToDto(UserEntity userEntity);

    UserEntity update(@MappingTarget UserEntity entity, SignUpRequestDto userDto);

    UserEntity toEntity(SignInRequestDto signInRequestDto);

    SignInRequestDto toDto(UserEntity userEntity);

    UserEntity update(@MappingTarget UserEntity entity, SignInRequestDto signInRequestDto);

}
