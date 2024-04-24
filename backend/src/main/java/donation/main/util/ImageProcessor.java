package donation.main.util;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.imageio.ImageIO;
import donation.main.exception.ImageConversionException;
import org.springframework.core.convert.ConversionFailedException;

public class ImageProcessor {
    public static final String BASE64_IMG_PREFIX = "data:image/png;base64,";
    private static final int SMALL_SIDE_MAX_SIZE = 100;

    private ImageProcessor() {
    }

    public static BufferedImage base64ToImage(String data) throws IOException {
        String base64Image = data.split(",")[1];
        byte[] bytes = Base64.getDecoder().decode(base64Image);
        return ImageIO.read(new ByteArrayInputStream(bytes));
    }

    public static byte[] imageToBase64Array(BufferedImage bufferedImage) throws IOException {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", os);
        String base64Image = new String(Base64.getMimeEncoder().encode(os.toByteArray()), StandardCharsets.UTF_8);
        return (BASE64_IMG_PREFIX + base64Image).getBytes();
    }

    public static BufferedImage resizeImage(BufferedImage originalImage) throws IOException {
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();
        double ratio = getScaleRatio(width, height);
        int targetWidth = (int) (width / ratio);
        int targetHeight = (int) (height / ratio);
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics2D = resizedImage.createGraphics();
        graphics2D.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
        graphics2D.dispose();
        return resizedImage;
    }

    public static byte[] resizeImage(String base64Image) {
        try {
            BufferedImage image = ImageProcessor.base64ToImage(base64Image);
            BufferedImage resizedImage = ImageProcessor.resizeImage(image);
            return ImageProcessor.imageToBase64Array(resizedImage);
        } catch (IOException e) {
            throw new ImageConversionException("Can't resize image!", e);
        }
    }

    private static double getScaleRatio(double width, double height) {
        return width < height ? width / SMALL_SIDE_MAX_SIZE : height / SMALL_SIDE_MAX_SIZE;
    }
}
