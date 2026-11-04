package br.edu.ifrs.poa.hcomplementares;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import br.edu.ifrs.poa.hcomplementares.config.LdapProperties;
import br.edu.ifrs.poa.hcomplementares.config.MailProperties;

@SpringBootApplication
@EnableConfigurationProperties({LdapProperties.class, MailProperties.class})
public class HcomplementaresApplication {

	public static void main(String[] args) {
		SpringApplication.run(HcomplementaresApplication.class, args);
	}

}
