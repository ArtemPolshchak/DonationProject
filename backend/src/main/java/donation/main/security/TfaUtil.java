package donation.main.security;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.util.Base64;
import donation.main.exception.TfaQrCodeGenerationException;
import donation.main.exception.TotpAuthenticationException;
import donation.main.util.ImageProcessor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TfaUtil {
    private final GoogleAuthenticator gAuth;
    private int qrHeight = 500;
    private int qrWidth = 500;
    private String companyName = "Company";

    public String createBase64QRCode(String account, GoogleAuthenticatorKey key) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            BitMatrix matrix = new MultiFormatWriter()
                    .encode(getBarCode(account, key), BarcodeFormat.QR_CODE, qrWidth, qrHeight);
            MatrixToImageWriter.writeToStream(matrix, "png", out);
            return ImageProcessor.BASE64_IMG_PREFIX + Base64.getEncoder().encodeToString(out.toByteArray());
        } catch (Exception e) {
            throw new TfaQrCodeGenerationException("Can't create QR code for " + account + " user! ", e);
        }
    }

    public void validateCode(String code, String key) throws AuthenticationException {
        String validCode = String.format("%06d", gAuth.getTotpPassword(key));
        if (!code.equals(validCode)) {
            throw new TotpAuthenticationException("TOTP not valid! Key: " + key + ", Code: " + code +  ", ValidCode: " + validCode);
        }
    }

    public GoogleAuthenticatorKey createAuthKey() {
        return gAuth.createCredentials();
    }

    private String getBarCode(String account, GoogleAuthenticatorKey key) {
        return GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL(companyName, account, key);
    }
}
