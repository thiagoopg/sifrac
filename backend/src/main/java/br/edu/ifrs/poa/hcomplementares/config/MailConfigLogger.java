package br.edu.ifrs.poa.hcomplementares.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.stereotype.Component;

/**
 * Registra no startup um resumo da configuracao de e-mail (sem senha)
 * e alerta sobre possiveis esquecimentos em producao.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MailConfigLogger implements ApplicationRunner {

    private final MailProperties mailProperties;
    private final Environment environment;

    @Value("${spring.mail.host:}")
    private String host;

    @Value("${spring.mail.port:0}")
    private int port;

    @Override
    public void run(ApplicationArguments args) {
        if (!mailProperties.enabled()) {
            log.info("[EMAIL] Envio desabilitado (app.mail.enabled=false). "
                    + "Use MAIL_ENABLED=true ou o perfil prod para ativar.");
            return;
        }

        log.info("[EMAIL] Envio habilitado: host={} port={} from={} avaliacaoAluno={} resumoPendencias={}",
                host,
                port,
                mailProperties.fromOuPadrao(),
                mailProperties.avaliacaoAlunoHabilitada(),
                mailProperties.resumoPendenciasHabilitado());

        boolean hostLocal = host == null || host.isBlank() || "localhost".equalsIgnoreCase(host);
        boolean prod = environment.acceptsProfiles(Profiles.of("prod"));

        if (prod && hostLocal) {
            log.warn("[EMAIL] Perfil prod ativo, mas spring.mail.host esta em '{}'. "
                    + "Configure MAIL_HOST ou config/application.properties antes de usar em producao.",
                    host);
        }
    }
}
