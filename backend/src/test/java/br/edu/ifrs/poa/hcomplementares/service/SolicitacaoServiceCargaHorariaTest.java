package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.dto.request.SolicitacaoCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.SolicitacaoResponse;
import br.edu.ifrs.poa.hcomplementares.entity.Aluno;
import br.edu.ifrs.poa.hcomplementares.entity.Curso;
import br.edu.ifrs.poa.hcomplementares.entity.SolicitacaoHoraComplementar;
import br.edu.ifrs.poa.hcomplementares.entity.TipoHoraComplementar;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;
import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import br.edu.ifrs.poa.hcomplementares.event.SolicitacaoCriadaEvent;
import br.edu.ifrs.poa.hcomplementares.exception.BusinessRuleException;
import br.edu.ifrs.poa.hcomplementares.repository.AlunoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.AnexoSolicitacaoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.CursoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.SolicitacaoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.TipoHoraComplementarRepository;
import br.edu.ifrs.poa.hcomplementares.repository.UsuarioRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Testes das regras de carga horária da criação de solicitações.
 *
 * <p>Cobrem os limites do tipo de atividade e do curso, a contabilização de
 * horas pendentes, os limites exatos (inclusivos), a aplicação das mesmas
 * regras nos fluxos com e sem anexo e a ausência de arquivos órfãos.</p>
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class SolicitacaoServiceCargaHorariaTest {

    private static final String LOGIN = "thiagolima";

    @Mock
    private SolicitacaoRepository solicitacaoRepository;
    @Mock
    private AlunoRepository alunoRepository;
    @Mock
    private TipoHoraComplementarRepository tipoHoraRepository;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private CursoRepository cursoRepository;
    @Mock
    private AnexoSolicitacaoRepository anexoSolicitacaoRepository;
    @Mock
    private NotificacaoService notificacaoService;
    @Mock
    private RequestAuditService requestAuditService;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private SolicitacaoService service;

    private Usuario usuario;
    private Curso curso;
    private Aluno aluno;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(LOGIN, "senha", List.of())
        );

        usuario = Usuario.builder()
                .id(10L)
                .nome("Thiago Adriel Oliveira de Lima")
                .email("thiago@ifrs.edu.br")
                .loginLdap(LOGIN)
                .perfil(UserProfile.ALUNO)
                .ativo(true)
                .build();

        curso = Curso.builder()
                .id(1L)
                .nome("Tecnologia em Sistemas para Internet")
                .cargaHorariaAcExigida(180)
                .build();

        aluno = Aluno.builder()
                .id(100L)
                .usuario(usuario)
                .curso(curso)
                .matricula("2024101001")
                .build();

        when(usuarioRepository.findByLoginLdapAndAtivoTrue(LOGIN))
                .thenReturn(Optional.of(usuario));
        when(alunoRepository.findByUsuarioId(usuario.getId()))
                .thenReturn(Optional.of(aluno));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // =====================================================
    // HELPERS
    // =====================================================

    private TipoHoraComplementar dadoTipo(Long id, String nome, Integer max) {
        TipoHoraComplementar tipo = TipoHoraComplementar.builder()
                .id(id)
                .nome(nome)
                .curso(curso)
                .cargaHorariaMaxima(max)
                .build();
        when(tipoHoraRepository.findById(id)).thenReturn(Optional.of(tipo));
        return tipo;
    }

    private void dadoHorasDoTipo(int deferidas, int pendentes) {
        when(solicitacaoRepository.sumHorasDeferidasByAlunoAndTipoHora(anyLong(), anyLong()))
                .thenReturn(deferidas);
        when(solicitacaoRepository.sumHorasPendentesByAlunoAndTipoHora(anyLong(), anyLong()))
                .thenReturn(pendentes);
    }

    private void dadoHorasDoCurso(int deferidas, int pendentes) {
        when(solicitacaoRepository.sumHorasDeferidasByAlunoAndCurso(anyLong(), anyLong()))
                .thenReturn(deferidas);
        when(solicitacaoRepository.sumHorasPendentesByAlunoAndCurso(anyLong(), anyLong()))
                .thenReturn(pendentes);
    }

    private void dadoSaveComId(Long id) {
        when(solicitacaoRepository.save(any()))
                .thenAnswer(invocation -> {
                    SolicitacaoHoraComplementar s = invocation.getArgument(0);
                    s.setId(id);
                    return s;
                });
    }

    private void configurarLimiteDoCurso(int carga) {
        curso.setCargaHorariaAcExigida(carga);
    }

    // =====================================================
    // FLUXO SEM ANEXO (criar)
    // =====================================================

    @Test
    void aceitaQuandoRespeitaOsDoisLimites() {
        dadoTipo(1L, "Curso de Extensão", 40);
        dadoHorasDoTipo(10, 5);   // 15 <= 40
        dadoHorasDoCurso(40, 20); // 60 <= 180
        dadoSaveComId(500L);

        SolicitacaoResponse resposta =
                service.criar(new SolicitacaoCreateRequest(1L, "Curso X", 10));

        assertThat(resposta.id()).isEqualTo(500L);
        assertThat(resposta.status()).isEqualTo(RequestStatus.PENDENTE);
        assertThat(resposta.horasSolicitadas()).isEqualTo(10);
        verify(solicitacaoRepository).save(any());
    }

    @Test
    void publicaSolicitacaoCriadaAoSolicitacaoSerCriada() {
        dadoTipo(1L, "Curso de Extensão", 40);
        dadoHorasDoTipo(10, 5);
        dadoHorasDoCurso(40, 20);
        dadoSaveComId(500L);

        service.criar(new SolicitacaoCreateRequest(1L, "Curso X", 10));

        ArgumentCaptor<SolicitacaoCriadaEvent> evento =
                ArgumentCaptor.forClass(SolicitacaoCriadaEvent.class);
        verify(eventPublisher).publishEvent(evento.capture());

        assertThat(evento.getValue().solicitacaoId()).isEqualTo(500L);
    }

    @Test
    void publicaSolicitacaoCriadaAoSolicitacaoSerCriadaComAnexo() {
        dadoTipo(1L, "Curso de Extensão", 1000);
        dadoHorasDoTipo(0, 0);
        dadoHorasDoCurso(0, 0);
        dadoSaveComId(501L);

        service.criarComAnexo(1L, "T", 5, null);

        ArgumentCaptor<SolicitacaoCriadaEvent> evento =
                ArgumentCaptor.forClass(SolicitacaoCriadaEvent.class);
        verify(eventPublisher).publishEvent(evento.capture());

        assertThat(evento.getValue().solicitacaoId()).isEqualTo(501L);
    }

    @Test
    void naoPublicaSolicitacaoCriadaQuandoValidacaoFalha() {
        dadoTipo(1L, "Curso de Extensão", 40);
        dadoHorasDoTipo(30, 5);   // +10 = 45 > 40
        dadoHorasDoCurso(0, 0);

        assertThatThrownBy(() ->
                service.criar(new SolicitacaoCreateRequest(1L, "T", 10)))
                .isInstanceOf(BusinessRuleException.class);

        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void rejeitaAoUltrapassarLimiteDoTipo() {
        dadoTipo(1L, "Curso de Extensão", 40);
        dadoHorasDoTipo(30, 5);   // +10 = 45 > 40
        dadoHorasDoCurso(0, 0);

        assertThatThrownBy(() ->
                service.criar(new SolicitacaoCreateRequest(1L, "T", 10)))
                .isInstanceOf(BusinessRuleException.class)
                .extracting(e -> ((BusinessRuleException) e).getErrorCode())
                .isEqualTo("TIPO_HORA_MAXIMA_EXCEDIDA");

        verify(solicitacaoRepository, never()).save(any());
    }

    @Test
    void rejeitaAoUltrapassarLimiteDoCurso() {
        dadoTipo(1L, "Curso de Extensão", 1000);
        dadoHorasDoTipo(0, 0);
        configurarLimiteDoCurso(100);
        dadoHorasDoCurso(60, 0); // +50 = 110 > 100

        assertThatThrownBy(() ->
                service.criar(new SolicitacaoCreateRequest(1L, "T", 50)))
                .isInstanceOf(BusinessRuleException.class)
                .extracting(e -> ((BusinessRuleException) e).getErrorCode())
                .isEqualTo("CURSO_CARGA_EXCEDIDA");

        verify(solicitacaoRepository, never()).save(any());
    }

    @Test
    void rejeitaQuandoUltrapassaAmbosOsLimitesComPrecedenciaDoTipo() {
        dadoTipo(1L, "Curso de Extensão", 40);
        dadoHorasDoTipo(40, 0); // +1 = 41 > 40
        configurarLimiteDoCurso(50);
        dadoHorasDoCurso(40, 20); // +1 = 61 > 50

        assertThatThrownBy(() ->
                service.criar(new SolicitacaoCreateRequest(1L, "T", 1)))
                .isInstanceOf(BusinessRuleException.class)
                .extracting(e -> ((BusinessRuleException) e).getErrorCode())
                .isEqualTo("TIPO_HORA_MAXIMA_EXCEDIDA");
    }

    @Test
    void rejeitaQuandoHorasPendentesEstouramLimiteDoTipo() {
        dadoTipo(1L, "Curso de Extensão", 40);
        dadoHorasDoTipo(0, 40);   // +1 = 41 > 40 (só pendentes)
        dadoHorasDoCurso(0, 0);

        assertThatThrownBy(() ->
                service.criar(new SolicitacaoCreateRequest(1L, "T", 1)))
                .isInstanceOf(BusinessRuleException.class)
                .extracting(e -> ((BusinessRuleException) e).getErrorCode())
                .isEqualTo("TIPO_HORA_MAXIMA_EXCEDIDA");
    }

    @Test
    void rejeitaQuandoHorasPendentesEstouramLimiteDoCurso() {
        dadoTipo(1L, "Curso de Extensão", 1000);
        dadoHorasDoTipo(0, 0);
        configurarLimiteDoCurso(100);
        dadoHorasDoCurso(0, 100); // +1 = 101 > 100 (só pendentes)

        assertThatThrownBy(() ->
                service.criar(new SolicitacaoCreateRequest(1L, "T", 1)))
                .isInstanceOf(BusinessRuleException.class)
                .extracting(e -> ((BusinessRuleException) e).getErrorCode())
                .isEqualTo("CURSO_CARGA_EXCEDIDA");
    }

    @Test
    void aceitaQuandoTotalProjetadoEhExatamenteIgualAosLimites() {
        dadoTipo(1L, "Curso de Extensão", 40);
        dadoHorasDoTipo(30, 9);   // +1 = 40 == 40
        configurarLimiteDoCurso(60);
        dadoHorasDoCurso(40, 19); // +1 = 60 == 60
        dadoSaveComId(1L);

        SolicitacaoResponse resposta =
                service.criar(new SolicitacaoCreateRequest(1L, "T", 1));

        assertThat(resposta).isNotNull();
        verify(solicitacaoRepository).save(any());
    }

    @Test
    void aceitaQuandoNaoHaSolicitacoesAnterioresTotalZero() {
        dadoTipo(1L, "Curso de Extensão", 10);
        dadoHorasDoTipo(0, 0);
        configurarLimiteDoCurso(100);
        dadoHorasDoCurso(0, 0);
        dadoSaveComId(1L);

        SolicitacaoResponse resposta =
                service.criar(new SolicitacaoCreateRequest(1L, "T", 5));

        assertThat(resposta.horasSolicitadas()).isEqualTo(5);
    }

    // =====================================================
    // MESMAS REGRAS NO FLUXO COM ANEXO (criarComAnexo)
    // =====================================================

    @Test
    void aplicaLimiteDoTipoNoFluxoComAnexo() {
        dadoTipo(1L, "Curso de Extensão", 40);
        dadoHorasDoTipo(40, 0); // +1 = 41 > 40
        dadoHorasDoCurso(0, 0);

        assertThatThrownBy(() ->
                service.criarComAnexo(1L, "T", 1, null))
                .isInstanceOf(BusinessRuleException.class)
                .extracting(e -> ((BusinessRuleException) e).getErrorCode())
                .isEqualTo("TIPO_HORA_MAXIMA_EXCEDIDA");

        verify(solicitacaoRepository, never()).save(any());
    }

    @Test
    void aplicaLimiteDoCursoNoFluxoComAnexo() {
        dadoTipo(1L, "Curso de Extensão", 1000);
        dadoHorasDoTipo(0, 0);
        configurarLimiteDoCurso(100);
        dadoHorasDoCurso(60, 0); // +50 = 110 > 100

        assertThatThrownBy(() ->
                service.criarComAnexo(1L, "T", 50, null))
                .isInstanceOf(BusinessRuleException.class)
                .extracting(e -> ((BusinessRuleException) e).getErrorCode())
                .isEqualTo("CURSO_CARGA_EXCEDIDA");
    }

    // =====================================================
    // ARQUIVO ÓRFÃO
    // =====================================================

    @Test
    void naoDeixaArquivoOrfaoQuandoPersistenciaDoAnexoFalha(@TempDir Path tempDir) {
        ReflectionTestUtils.setField(service, "uploadDir", tempDir.toString());

        dadoTipo(1L, "Curso de Extensão", 1000);
        dadoHorasDoTipo(0, 0);
        dadoHorasDoCurso(0, 0);
        dadoSaveComId(999L);

        when(anexoSolicitacaoRepository.save(any()))
                .thenThrow(new RuntimeException("falha ao persistir anexo"));

        MockMultipartFile arquivo = new MockMultipartFile(
                "arquivo", "certificado.pdf", "application/pdf",
                "conteudo".getBytes()
        );

        assertThatThrownBy(() ->
                service.criarComAnexo(1L, "T", 5, arquivo))
                .isInstanceOf(RuntimeException.class);

        Path diretorioDaSolicitacao = tempDir.resolve("999");
        assertThat(Files.exists(diretorioDaSolicitacao)).isFalse();
    }
}
