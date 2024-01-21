package donation.main.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Value("${api.ver}")
    private String version;
    @Value("${api.description}")
    private String description;

    @Bean
    public OpenAPI customOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("REST API")
                        .description(description)
                        .termsOfService("http://restapi.com")
                        .version(version)

                );
    }
}

