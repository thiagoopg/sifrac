package br.edu.ifrs.poa.hcomplementares.listener;

import br.edu.ifrs.poa.hcomplementares.config.MailProperties;
import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;
import br.edu.ifrs.poa.hcomplementares.event.SolicitacaoAvaliadaEvent;
import br.edu.ifrs.poa.hcomplementares.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.thymeleaf.context.Context;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

/**
 * Testes do listener de email de avaliacao.
 */
@ExtendWith(MockitoExtension.class)
class AvaliacaoAlunoListenerTest {

    private static final String ALUNO_EMAIL = "aluno@ifrs.edu.br";

    @Mock
    private EmailService emailService;

    private MailProperties properties;
    private AvaliacaoAlunoListener listener;
    private SolicitacaoAvaliadaEvent event;

    @BeforeEach
    void setUp() {
        properties = new MailProperties(
                true,
                "no-reply@ifrs.edu.br",
                true,
                true,
                "https://horas.ifrs.edu.br"
        );
        listener = new AvaliacaoAlunoListener(emailService, properties);

        event = new SolicitacaoAvaliadaEvent(
                99L,
                ALUNO_EMAIL,
                "Thiago Adriel",
                "Curso de Extensao",
                RequestStatus.DEFERIDO,
                20,
                20,
                "Certificado validado.",
                "Tecnologia em Sistemas para Internet",
                "Curso de Extensao",
                "Maria Coordenadora"
        );
    }

    @Test
    void montaContextoEEnviaEmailDeAvaliacao() {
        listener.onSolicitacaoAvaliada(event);

        ArgumentCaptor<String> assunto = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Context> contexto = ArgumentCaptor.forClass(Context.class);

        verify(emailService).enviarAvaliacaoAluno(
                eq(ALUNO_EMAIL),
                assunto.capture(),
                contexto.capture()
        );

        assertThat(assunto.getValue())
                .isEqualTo("Sua solicitacao 'Curso de Extensao' foi DEFERIDO");

        Context ctx = contexto.getValue();
        assertThat(ctx.getVariable("alunoNome")).isEqualTo("Thiago Adriel");
        assertThat(ctx.getVariable("solicitacaoTitulo")).isEqualTo("Curso de Extensao");
        assertThat(ctx.getVariable("cursoNome"))
                .isEqualTo("Tecnologia em Sistemas para Internet");
        assertThat(ctx.getVariable("tipoHoraNome")).isEqualTo("Curso de Extensao");
        assertThat(ctx.getVariable("horasSolicitadas")).isEqualTo(20);
        assertThat(ctx.getVariable("horasDeferidas")).isEqualTo(20);
        assertThat(ctx.getVariable("justificativaCoordenador")).isEqualTo("Certificado validado.");
        assertThat(ctx.getVariable("status")).isEqualTo("DEFERIDO");
        assertThat(ctx.getVariable("coordenadorNome")).isEqualTo("Maria Coordenadora");
    }

    @Test
    void naoEnviaQuandoAvaliacaoAoAlunoDesabilitada() {
        properties = new MailProperties(
                true,
                "no-reply@ifrs.edu.br",
                false,
                true,
                "https://horas.ifrs.edu.br"
        );
        listener = new AvaliacaoAlunoListener(emailService, properties);

        listener.onSolicitacaoAvaliada(event);

        verifyNoInteractions(emailService);
    }

    @Test
    void naoPropagaFalhaDoEnvioDeEmail() {
        doThrow(new RuntimeException("falha no envio"))
                .when(emailService).enviarAvaliacaoAluno(
                        anyString(),
                        anyString(),
                        any(Context.class)
                );

        assertThatCode(() -> listener.onSolicitacaoAvaliada(event))
                .doesNotThrowAnyException();
    }
}
