package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.config.MailProperties;
import br.edu.ifrs.poa.hcomplementares.dto.response.EmailTesteResponse;
import jakarta.mail.Address;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.same;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

/**
 * Testes do EmailService usando mocks (sem SMTP real).
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class EmailServiceTest {

    private static final String REMETENTE = "no-reply@ifrs.edu.br";
    private static final String BASE_URL = "https://horas.ifrs.edu.br";

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private TemplateEngine templateEngine;

    private MailProperties properties;
    private EmailService service;
    private MimeMessage mimeMessage;

    @BeforeEach
    void setUp() {
        properties = new MailProperties(true, REMETENTE, true, true, BASE_URL);
        service = new EmailService(mailSender, templateEngine, properties);

        mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        lenient().when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        lenient().when(templateEngine.process(anyString(), any(Context.class)))
                .thenReturn("<html><body>conteudo do template</body></html>");
    }

    // Testes de envio de avaliacao para o aluno

    @Test
    void enviaAvaliacaoQuandoHabilitado() throws Exception {
        Context context = new Context();

        service.enviarAvaliacaoAluno("aluno@ifrs.edu.br", "Retorno da avaliacao", context);

        MimeMessage enviada = capturarMensagem();
        assertThat(enviada.getSubject()).isEqualTo("Retorno da avaliacao");
        assertThat(enviada.getFrom())
                .extracting(Address::toString)
                .containsExactly(REMETENTE);
        assertThat(enviada.getAllRecipients())
                .extracting(Address::toString)
                .containsExactly("aluno@ifrs.edu.br");
        assertThat(conteudoHtml(enviada)).contains("conteudo do template");
        assertThat(context.getVariable("baseUrl")).isEqualTo(BASE_URL);
        verify(templateEngine).process(eq("email/avaliacao-retorno-aluno"), same(context));
    }

    @Test
    void naoEnviaAvaliacaoQuandoEnvioAutomaticoDesabilitado() {
        properties = new MailProperties(false, REMETENTE, true, true, BASE_URL);
        service = new EmailService(mailSender, templateEngine, properties);

        service.enviarAvaliacaoAluno("aluno@ifrs.edu.br", "Retorno", new Context());

        verifyNoInteractions(mailSender, templateEngine);
    }

    @Test
    void naoEnviaAvaliacaoQuandoDestinatarioVazio() {
        service.enviarAvaliacaoAluno("   ", "Retorno", new Context());

        verifyNoInteractions(mailSender, templateEngine);
    }

    @Test
    void naoPropagaFalhaDeSmtpNaAvaliacao() {
        doThrow(new MailSendException("SMTP indisponivel"))
                .when(mailSender).send(any(MimeMessage.class));

        assertThatCode(() -> service.enviarAvaliacaoAluno(
                "aluno@ifrs.edu.br", "Retorno", new Context()
        )).doesNotThrowAnyException();
    }

    // Testes de resumo de pendencias

    @Test
    void enviaResumoQuandoHabilitadoERetornaTrue() throws Exception {
        boolean enviado = service.enviarResumoPendencias(
                "coordenador@ifrs.edu.br", "Resumo de pendencias", new Context()
        );

        assertThat(enviado).isTrue();
        MimeMessage enviada = capturarMensagem();
        assertThat(enviada.getSubject()).isEqualTo("Resumo de pendencias");
        assertThat(enviada.getAllRecipients())
                .extracting(Address::toString)
                .containsExactly("coordenador@ifrs.edu.br");
        verify(templateEngine).process(eq("email/resumo-pendencias"), any(Context.class));
    }

    @Test
    void retornaFalseQuandoResumoDesabilitado() {
        properties = new MailProperties(false, REMETENTE, true, true, BASE_URL);
        service = new EmailService(mailSender, templateEngine, properties);

        boolean enviado = service.enviarResumoPendencias(
                "coordenador@ifrs.edu.br", "Resumo", new Context()
        );

        assertThat(enviado).isFalse();
        verifyNoInteractions(mailSender, templateEngine);
    }

    @Test
    void retornaFalseQuandoCoordenadorSemEmail() {
        boolean enviado = service.enviarResumoPendencias("", "Resumo", new Context());

        assertThat(enviado).isFalse();
        verifyNoInteractions(mailSender, templateEngine);
    }

    @Test
    void retornaFalseQuandoFalhaDeSmtpNoResumo() {
        doThrow(new MailSendException("SMTP indisponivel"))
                .when(mailSender).send(any(MimeMessage.class));

        boolean enviado = service.enviarResumoPendencias(
                "coordenador@ifrs.edu.br", "Resumo", new Context()
        );

        assertThat(enviado).isFalse();
    }

    // Testes de email de configuracao

    @Test
    void enviaTesteMesmoComEnvioAutomaticoDesabilitado() throws Exception {
        properties = new MailProperties(false, REMETENTE, false, false, BASE_URL);
        service = new EmailService(mailSender, templateEngine, properties);

        EmailTesteResponse resposta = service.enviarTeste("admin@ifrs.edu.br");

        assertThat(resposta.sucesso()).isTrue();
        assertThat(resposta.destinatario()).isEqualTo("admin@ifrs.edu.br");
        assertThat(resposta.mensagem()).contains("sucesso");

        MimeMessage enviada = capturarMensagem();
        assertThat(enviada.getSubject())
                .isEqualTo("Teste de configuracao de e-mail - Horas Complementares");
        assertThat(enviada.getAllRecipients())
                .extracting(Address::toString)
                .containsExactly("admin@ifrs.edu.br");
        verify(templateEngine).process(eq("email/teste-configuracao"), any(Context.class));
    }

    @Test
    void retornaFalhaQuandoSmtpDoEmailDeTesteFalha() {
        doThrow(new MailSendException("conexao recusada"))
                .when(mailSender).send(any(MimeMessage.class));

        EmailTesteResponse resposta = service.enviarTeste("admin@ifrs.edu.br");

        assertThat(resposta.sucesso()).isFalse();
        assertThat(resposta.destinatario()).isEqualTo("admin@ifrs.edu.br");
        assertThat(resposta.mensagem()).contains("MailSendException");
    }

    // Helpers

    private MimeMessage capturarMensagem() {
        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender).send(captor.capture());
        return captor.getValue();
    }

    private String conteudoHtml(MimeMessage mensagem) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        mensagem.writeTo(out);
        return out.toString(StandardCharsets.UTF_8);
    }
}
