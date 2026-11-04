package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.config.MailProperties;
import br.edu.ifrs.poa.hcomplementares.entity.Aluno;
import br.edu.ifrs.poa.hcomplementares.entity.CoordenadorNotificacaoPendencia;
import br.edu.ifrs.poa.hcomplementares.entity.Curso;
import br.edu.ifrs.poa.hcomplementares.entity.SolicitacaoHoraComplementar;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;
import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import br.edu.ifrs.poa.hcomplementares.repository.CoordenadorNotificacaoPendenciaRepository;
import br.edu.ifrs.poa.hcomplementares.repository.SolicitacaoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.SolicitacaoRepository.PendenciaPorCurso;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

/**
 * Testes da regra de resumo de pendencias.
 * Regra: so envia quando o total atual supera o ultimo envio.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class EmailResumoPendenciasServiceTest {

    private static final Long SOLICITACAO_ID = 99L;
    private static final Long COORDENADOR_ID = 7L;
    private static final String COORDENADOR_EMAIL = "coordenador@ifrs.edu.br";
    private static final String COORDENADOR_NOME = "Maria Coordenadora";

    @Mock
    private SolicitacaoRepository solicitacaoRepository;

    @Mock
    private CoordenadorNotificacaoPendenciaRepository notificacaoRepository;

    @Mock
    private EmailService emailService;

    private MailProperties properties;
    private EmailResumoPendenciasService service;
    private Usuario coordenador;
    private Curso curso;
    private SolicitacaoHoraComplementar solicitacao;

    @BeforeEach
    void setUp() {
        properties = new MailProperties(true, "no-reply@ifrs.edu.br", true, true, "https://horas.ifrs.edu.br");

        coordenador = Usuario.builder()
                .id(COORDENADOR_ID)
                .nome(COORDENADOR_NOME)
                .email(COORDENADOR_EMAIL)
                .loginLdap("coord")
                .perfil(UserProfile.COORDENADOR)
                .ativo(true)
                .build();

        curso = Curso.builder()
                .id(1L)
                .nome("Tecnologia em Sistemas para Internet")
                .coordenador(coordenador)
                .build();

        Usuario alunoUsuario = Usuario.builder()
                .id(10L)
                .nome("Aluno Teste")
                .email("aluno@ifrs.edu.br")
                .loginLdap("aluno")
                .perfil(UserProfile.ALUNO)
                .ativo(true)
                .build();

        Aluno aluno = Aluno.builder()
                .id(100L)
                .usuario(alunoUsuario)
                .curso(curso)
                .matricula("2024101001")
                .build();

        solicitacao = SolicitacaoHoraComplementar.builder()
                .id(SOLICITACAO_ID)
                .aluno(aluno)
                .status(RequestStatus.PENDENTE)
                .build();

        service = new EmailResumoPendenciasService(
                solicitacaoRepository,
                notificacaoRepository,
                emailService,
                properties
        );

        when(solicitacaoRepository.findById(SOLICITACAO_ID))
                .thenReturn(Optional.of(solicitacao));
        when(notificacaoRepository.findFirstByCoordenadorIdOrderByDataReferenciaDesc(COORDENADOR_ID))
                .thenReturn(Optional.empty());
        when(notificacaoRepository.findByCoordenadorIdAndDataReferencia(eq(COORDENADOR_ID), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(emailService.enviarResumoPendencias(anyString(), anyString(), any(Context.class)))
                .thenReturn(true);
        when(notificacaoRepository.save(any(CoordenadorNotificacaoPendencia.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    // Testes da regra de aumento

    @Test
    void enviaQuandoTotalSuperaUltimoEnvio() {
        dadoPendencias(pendencia("Tecnologia em Sistemas para Internet", 2));
        dadoUltimoEnvio(1);

        service.processar(SOLICITACAO_ID);

        EnvioCapturado envio = capturarEnvio();
        assertThat(envio.assunto())
                .isEqualTo("Resumo de pendencias: 2 solicitacoes aguardando avaliacao");
        assertThat(envio.contexto().getVariable("coordenadorNome")).isEqualTo(COORDENADOR_NOME);
        assertThat(envio.contexto().getVariable("totalPendencias")).isEqualTo(2L);
        assertThat(envio.contexto().getVariable("dataReferencia"))
                .isEqualTo(LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        @SuppressWarnings("unchecked")
        Map<String, Long> pendencias = (Map<String, Long>) envio.contexto()
                .getVariable("pendenciasPorCurso");
        assertThat(pendencias)
                .containsEntry("Tecnologia em Sistemas para Internet", 2L);

        CoordenadorNotificacaoPendencia registro = capturarRegistroSalvo();
        assertThat(registro.getCoordenador()).isSameAs(coordenador);
        assertThat(registro.getDataReferencia()).isEqualTo(LocalDate.now());
        assertThat(registro.getUltimaQuantidadeEnviada()).isEqualTo(2);
        assertThat(registro.getEnviadoEm()).isNotNull();
    }

    @Test
    void enviaQuandoNaoExisteRegistroAnterior() {
        dadoPendencias(pendencia("Tecnologia em Sistemas para Internet", 3));

        service.processar(SOLICITACAO_ID);

        assertThat(capturarEnvio().assunto())
                .isEqualTo("Resumo de pendencias: 3 solicitacoes aguardando avaliacao");
        assertThat(capturarRegistroSalvo().getUltimaQuantidadeEnviada()).isEqualTo(3);
    }

    @Test
    void usaSingularQuandoHaUmaPendencia() {
        dadoPendencias(pendencia("Tecnologia em Sistemas para Internet", 1));

        service.processar(SOLICITACAO_ID);

        assertThat(capturarEnvio().assunto())
                .isEqualTo("Resumo de pendencias: 1 solicitacao aguardando avaliacao");
    }

    @Test
    void somaPendenciasDeMultiplosCursos() {
        dadoPendencias(
                pendencia("Curso A", 2),
                pendencia("Curso B", 3)
        );

        service.processar(SOLICITACAO_ID);

        Context contexto = capturarEnvio().contexto();
        assertThat(contexto.getVariable("totalPendencias")).isEqualTo(5L);

        @SuppressWarnings("unchecked")
        Map<String, Long> pendencias = (Map<String, Long>) contexto
                .getVariable("pendenciasPorCurso");
        assertThat(pendencias)
                .containsEntry("Curso A", 2L)
                .containsEntry("Curso B", 3L);
        assertThat(capturarRegistroSalvo().getUltimaQuantidadeEnviada()).isEqualTo(5);
    }

    // Casos em que nao deve enviar

    @Test
    void naoEnviaQuandoTotalIgualAoUltimoEnvio() {
        dadoPendencias(pendencia("Curso A", 2));
        dadoUltimoEnvio(2);

        service.processar(SOLICITACAO_ID);

        verifyNoInteractions(emailService);
        verify(notificacaoRepository, never()).save(any(CoordenadorNotificacaoPendencia.class));
    }

    @Test
    void naoEnviaQuandoTotalMenorQueUltimoEnvio() {
        dadoPendencias(pendencia("Curso A", 1));
        dadoUltimoEnvio(5);

        service.processar(SOLICITACAO_ID);

        verifyNoInteractions(emailService);
        verify(notificacaoRepository, never()).save(any(CoordenadorNotificacaoPendencia.class));
    }

    @Test
    void naoEnviaQuandoTotalZero() {
        dadoPendencias();

        service.processar(SOLICITACAO_ID);

        verifyNoInteractions(emailService);
        verify(notificacaoRepository, never()).save(any(CoordenadorNotificacaoPendencia.class));
    }

    @Test
    void naoEnviaQuandoSolicitacaoNaoExiste() {
        when(solicitacaoRepository.findById(SOLICITACAO_ID))
                .thenReturn(Optional.empty());

        service.processar(SOLICITACAO_ID);

        verifyNoInteractions(emailService);
        verify(notificacaoRepository, never()).save(any(CoordenadorNotificacaoPendencia.class));
    }

    @Test
    void naoEnviaQuandoCursoNaoTemCoordenador() {
        curso.setCoordenador(null);

        service.processar(SOLICITACAO_ID);

        verifyNoInteractions(emailService);
        verify(solicitacaoRepository, never())
                .contarPendenciasPorCursoDoCoordenador(anyLong(), any(RequestStatus.class));
        verify(notificacaoRepository, never()).save(any(CoordenadorNotificacaoPendencia.class));
    }

    @Test
    void naoProcessaQuandoResumoDesabilitado() {
        properties = new MailProperties(true, "no-reply@ifrs.edu.br", true, false, "https://horas.ifrs.edu.br");
        service = new EmailResumoPendenciasService(
                solicitacaoRepository,
                notificacaoRepository,
                emailService,
                properties
        );

        service.processar(SOLICITACAO_ID);

        verifyNoInteractions(solicitacaoRepository, notificacaoRepository, emailService);
    }

    // Falha de envio e registro

    @Test
    void naoRegistraEnvioQuandoEmailFalha() {
        dadoPendencias(pendencia("Curso A", 2));
        when(emailService.enviarResumoPendencias(anyString(), anyString(), any(Context.class)))
                .thenReturn(false);

        service.processar(SOLICITACAO_ID);

        verify(emailService).enviarResumoPendencias(eq(COORDENADOR_EMAIL), anyString(), any(Context.class));
        verify(notificacaoRepository, never()).save(any(CoordenadorNotificacaoPendencia.class));
    }

    @Test
    void atualizaRegistroDoMesmoDiaEmVezDeCriarOutro() {
        dadoPendencias(pendencia("Curso A", 2));
        dadoUltimoEnvio(1);

        CoordenadorNotificacaoPendencia existente = CoordenadorNotificacaoPendencia.builder()
                .id(42L)
                .coordenador(coordenador)
                .dataReferencia(LocalDate.now())
                .ultimaQuantidadeEnviada(1)
                .build();
        when(notificacaoRepository.findByCoordenadorIdAndDataReferencia(COORDENADOR_ID, LocalDate.now()))
                .thenReturn(Optional.of(existente));

        service.processar(SOLICITACAO_ID);

        CoordenadorNotificacaoPendencia registro = capturarRegistroSalvo();
        assertThat(registro).isSameAs(existente);
        assertThat(registro.getId()).isEqualTo(42L);
        assertThat(registro.getUltimaQuantidadeEnviada()).isEqualTo(2);
        assertThat(registro.getEnviadoEm()).isNotNull();
    }

    // Helpers

    private void dadoPendencias(PendenciaPorCurso... pendencias) {
        when(solicitacaoRepository.contarPendenciasPorCursoDoCoordenador(
                COORDENADOR_ID,
                RequestStatus.PENDENTE
        )).thenReturn(List.of(pendencias));
    }

    private void dadoUltimoEnvio(int quantidade) {
        CoordenadorNotificacaoPendencia ultimo = CoordenadorNotificacaoPendencia.builder()
                .id(1L)
                .coordenador(coordenador)
                .dataReferencia(LocalDate.now().minusDays(1))
                .ultimaQuantidadeEnviada(quantidade)
                .build();
        when(notificacaoRepository.findFirstByCoordenadorIdOrderByDataReferenciaDesc(COORDENADOR_ID))
                .thenReturn(Optional.of(ultimo));
    }

    private PendenciaPorCurso pendencia(String cursoNome, long quantidade) {
        return new PendenciaPorCurso() {
            @Override
            public String getCursoNome() {
                return cursoNome;
            }

            @Override
            public Long getQuantidade() {
                return quantidade;
            }
        };
    }

    private EnvioCapturado capturarEnvio() {
        ArgumentCaptor<String> assunto = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Context> contexto = ArgumentCaptor.forClass(Context.class);
        verify(emailService).enviarResumoPendencias(
                eq(COORDENADOR_EMAIL),
                assunto.capture(),
                contexto.capture()
        );
        return new EnvioCapturado(assunto.getValue(), contexto.getValue());
    }

    private CoordenadorNotificacaoPendencia capturarRegistroSalvo() {
        ArgumentCaptor<CoordenadorNotificacaoPendencia> captor =
                ArgumentCaptor.forClass(CoordenadorNotificacaoPendencia.class);
        verify(notificacaoRepository).save(captor.capture());
        return captor.getValue();
    }

    private record EnvioCapturado(String assunto, Context contexto) {
    }
}
