package org.example.cryptocurrency.config;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI(){
        return new OpenAPI()
                .info(new Info()
                        .title("Crypto Project API")
                        .version("1.0")
                        .description("API documentation for Crypto Project")
                        .contact(new Contact()
                                .name("Stefan")
                                .email("stefan.ivanov1227@gmail.com")
                                .url("http://localhost:8080"))
                        .license(new License()
                                .name("License")
                                .url("http://some-url.com"))
                        .termsOfService("http://some-url.com/terms"))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local ENV"),
                        new Server().url("http://api.cryptoCurrency.com").description("PROD ENV")
                ))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("basicAuth", new SecurityScheme()
                                .name("basicAuth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("basic")
                                .in(SecurityScheme.In.HEADER)))
                .addSecurityItem(new SecurityRequirement()
                        .addList("basicAuth"));
    }
}