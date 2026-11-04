package br.edu.ifrs.poa.hcomplementares.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuracao de envio de e-mail do sistema.
 *
 * <p>Todos os campos podem ser definidos por variavel de ambiente
 * ({@code MAIL_ENABLED}, {@code MAIL_FROM}, ...) ou por um arquivo
 * externo {@code config/application.properties}. Nenhuma credencial
 * deve ser versionada no repositorio.</p>
 */
@ConfigurationProperties(prefix = "app.mail")
public record MailProperties(
        boolean enabled,
        String from,
        Boolean avaliacaoAlunoEnabled,
        Boolean resumoPendenciasEnabled,
        String baseUrl
) {

    public boolean avaliacaoAlunoHabilitada() {
        return Boolean.TRUE.equals(avaliacaoAlunoEnabled);
    }

    public boolean resumoPendenciasHabilitado() {
        return Boolean.TRUE.equals(resumoPendenciasEnabled);
    }

    public String fromOuPadrao() {
        return (from == null || from.isBlank())
                ? "no-reply@hcomplementares.ifrs.edu.br"
                : from;
    }

    public String baseUrlOuPadrao() {
        return (baseUrl == null || baseUrl.isBlank())
                ? "http://localhost:5173"
                : baseUrl;
    }
}
