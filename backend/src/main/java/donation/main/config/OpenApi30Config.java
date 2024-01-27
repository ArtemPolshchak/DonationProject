package donation.main.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApi30Config {
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

//    @Bean
//    public OpenAPI customizeOpenApi() {
//        final String securitySchemeName = "Bearer Authentication";
//        return new OpenAPI()
//                .info(new Info()
//                        .title("DonationProject App API")
//                        .version(version)
//                        .description(description))
//                .addSecurityItem(new SecurityRequirement()
//                        .addList(securitySchemeName))
//                .components(new Components()
//                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
//                                .name(securitySchemeName)
//                                .type(SecurityScheme.Type.HTTP)
//                                .scheme("bearer")
//                                .bearerFormat("JWT"))
//                );
//    }
}

