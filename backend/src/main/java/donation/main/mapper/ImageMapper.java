package donation.main.mapper;

import java.nio.charset.StandardCharsets;
import donation.main.config.MapperConfig;
import donation.main.dto.transactiondto.ImageResponseDto;
import donation.main.entity.ImageEntity;
import org.mapstruct.Mapper;

@Mapper(config = MapperConfig.class)
public interface ImageMapper {

    ImageResponseDto toDto(ImageEntity entity);

    default ImageEntity base64ToImage(String base64Image) {
        return base64Image == null ? null
                : ImageEntity.builder().data(base64Image.getBytes(StandardCharsets.UTF_8)).build();
    }

    default String byteArrayToBase64(byte[] image) {
        return new String(image);
    }
}