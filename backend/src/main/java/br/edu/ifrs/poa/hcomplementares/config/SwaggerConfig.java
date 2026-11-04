package br.edu.ifrs.poa.hcomplementares.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("HComplementares API")
                        .description("API para gestão de Horas Complementares do IFRS — Campus Porto Alegre")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipe HComplementares")
                                .email("hcomplementares@ifrs.edu.br"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
