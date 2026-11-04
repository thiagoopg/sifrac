package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.config.MailProperties;
import br.edu.ifrs.poa.hcomplementares.dto.response.EmailTesteResponse;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final MailProperties mailProperties;

    /**
     * Envia o retorno da avaliacao para o aluno via template HTML.
     * Eh chamado de forma assincrona por um listener de transacao,
     * portanto falhas de SMTP nunca interrompem o fluxo principal.
     */
    public void enviarAvaliacaoAluno(String to, String assunto, Context context) {
        if (!mailProperties.enabled()) {
            log.debug("[EMAIL] app.mail.enabled=false. Ignorando envio para {}", to);
            return;
        }
        if (destinatarioInvalido(to)) {
            log.warn("[EMAIL] Destinatario vazio. Ignorando envio de avaliacao para aluno.");
            return;
        }
        try {
            enviarHtml(to, assunto, "email/avaliacao-retorno-aluno", context);
            log.info("[EMAIL] Avaliacao enviada para aluno: {} assunto='{}'", to, assunto);
        } catch (Exception e) {
            log.error("[EMAIL] Falha ao enviar email de avaliacao para {}: {}", to, e.getMessage(), e);
        }
    }

    /**
     * Envia o resumo de solicitacoes pendentes ao coordenador.
     * Retorna true se o envio foi bem-sucedido (usado para registrar
     * a quantidade enviada no banco de dados).
     */
    public boolean enviarResumoPendencias(String to, String assunto, Context context) {
        if (!mailProperties.enabled()) {
            log.debug("[EMAIL] app.mail.enabled=false. Ignorando resumo para coordenador {}", to);
            return false;
        }
        if (destinatarioInvalido(to)) {
            log.warn("[EMAIL] Coordenador sem e-mail cadastrado. Ignorando resumo de pendencias.");
            return false;
        }
        try {
            enviarHtml(to, assunto, "email/resumo-pendencias", context);
            log.info("[EMAIL] Resumo de pendencias enviado para coordenador: {} assunto='{}'", to, assunto);
            return true;
        } catch (Exception e) {
            log.error("[EMAIL] Falha ao enviar resumo de pendencias para {}: {}", to, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Envia um e-mail de teste de configuracao SMTP.
     * Ignora app.mail.enabled pois o objetivo eh justamente validar
     * a configuracao antes de habilitar o envio automatico.
     */
    public EmailTesteResponse enviarTeste(String destinatario) {
        Context context = new Context();
        context.setVariable("destinatario", destinatario);
        context.setVariable("remetente", mailProperties.fromOuPadrao());
        context.setVariable("dataHora", LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'as' HH:mm")));

        try {
            enviarHtml(
                    destinatario,
                    "Teste de configuracao de e-mail - Horas Complementares",
                    "email/teste-configuracao",
                    context
            );
            log.info("[EMAIL] E-mail de teste enviado para {}", destinatario);
            return new EmailTesteResponse(
                    true,
                    "E-mail de teste enviado com sucesso. Verifique a caixa de entrada.",
                    destinatario
            );
        } catch (Exception e) {
            log.error("[EMAIL] Falha no e-mail de teste para {}: {}", destinatario, e.getMessage(), e);
            return new EmailTesteResponse(
                    false,
                    "Falha ao enviar o e-mail de teste: " + e.getClass().getSimpleName()
                            + (e.getMessage() != null ? " - " + e.getMessage() : ""),
                    destinatario
            );
        }
    }

    private void enviarHtml(String to, String assunto, String template, Context context) throws Exception {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                true,
                StandardCharsets.UTF_8.name()
        );

        helper.setFrom(mailProperties.fromOuPadrao());
        helper.setTo(to);
        helper.setSubject(assunto);

        context.setVariable("baseUrl", mailProperties.baseUrlOuPadrao());
        String html = templateEngine.process(template, context);
        helper.setText(html, true);

        mailSender.send(mimeMessage);
    }

    private boolean destinatarioInvalido(String to) {
        return to == null || to.isBlank();
    }
}
