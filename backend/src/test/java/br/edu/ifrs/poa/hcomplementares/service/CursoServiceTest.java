package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.dto.request.CursoCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.request.CursoUpdateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.CursoResponse;
import br.edu.ifrs.poa.hcomplementares.entity.Campus;
import br.edu.ifrs.poa.hcomplementares.entity.Curso;
import br.edu.ifrs.poa.hcomplementares.entity.GrauCurso;
import br.edu.ifrs.poa.hcomplementares.exception.BusinessRuleException;
import br.edu.ifrs.poa.hcomplementares.exception.ResourceConflictException;
import br.edu.ifrs.poa.hcomplementares.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.hcomplementares.repository.CampusRepository;
import br.edu.ifrs.poa.hcomplementares.repository.CursoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.GrauCursoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Testes do cadastro/edição de cursos: resolução do grau e duplicidade de e-mail.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CursoServiceTest {

    @Mock private CursoRepository cursoRepository;
    @Mock private CampusRepository campusRepository;
    @Mock private GrauCursoRepository grauCursoRepository;
    @Mock private UsuarioRepository usuarioRepository;

    @InjectMocks private CursoService cursoService;

    private static final Long CAMPUS_ID = 1L;
    private static final Long GRAU_ID = 3L;

    private Campus campus() {
        return Campus.builder().id(CAMPUS_ID).nome("Porto Alegre").sigla("POA").build();
    }

    private GrauCurso grau() {
        return GrauCurso.builder().id(GRAU_ID).nome("Bacharelado").build();
    }

    private CursoCreateRequest criarRequest(String email) {
        return new CursoCreateRequest("Curso Teste", CAMPUS_ID, GRAU_ID, email, 120, null);
    }

    @Test
    void criar_deveResolverGrauPorId_eRetornarResponseComGrau() {
        when(cursoRepository.existsByNomeAndCampusId(any(), any())).thenReturn(false);
        when(cursoRepository.existsByEmailCoordenacao(any())).thenReturn(false);
        when(campusRepository.findById(CAMPUS_ID)).thenReturn(Optional.of(campus()));
        when(grauCursoRepository.findById(GRAU_ID)).thenReturn(Optional.of(grau()));
        when(cursoRepository.save(any(Curso.class))).thenAnswer(inv -> inv.getArgument(0));

        CursoResponse response = cursoService.criar(criarRequest("curso@ifrs.edu.br"));

        assertThat(response.grauId()).isEqualTo(GRAU_ID);
        assertThat(response.grauNome()).isEqualTo("Bacharelado");
    }

    @Test
    void criar_deveLancarNotFound_quandoGrauInexistente() {
        when(cursoRepository.existsByNomeAndCampusId(any(), any())).thenReturn(false);
        when(cursoRepository.existsByEmailCoordenacao(any())).thenReturn(false);
        when(campusRepository.findById(CAMPUS_ID)).thenReturn(Optional.of(campus()));
        when(grauCursoRepository.findById(GRAU_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cursoService.criar(criarRequest("curso@ifrs.edu.br")))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(cursoRepository, never()).save(any());
    }

    @Test
    void criar_deveLancarConflito_quandoEmailDuplicado() {
        when(cursoRepository.existsByNomeAndCampusId(any(), any())).thenReturn(false);
        when(cursoRepository.existsByEmailCoordenacao("curso@ifrs.edu.br")).thenReturn(true);

        assertThatThrownBy(() -> cursoService.criar(criarRequest("curso@ifrs.edu.br")))
                .isInstanceOf(ResourceConflictException.class)
                .hasFieldOrPropertyWithValue("errorCode", "EMAIL_COORDENACAO_ALREADY_EXISTS");

        verify(cursoRepository, never()).save(any());
    }

    @Test
    void criar_deveLancarBusinessRule_quandoNomeDuplicadoNoCampus() {
        when(cursoRepository.existsByNomeAndCampusId(any(), any())).thenReturn(true);

        assertThatThrownBy(() -> cursoService.criar(criarRequest("curso@ifrs.edu.br")))
                .isInstanceOf(BusinessRuleException.class)
                .hasFieldOrPropertyWithValue("errorCode", "CURSO_ALREADY_EXISTS");

        verify(cursoRepository, never()).save(any());
    }

    @Test
    void atualizar_deveLancarConflito_quandoEmailPertenceAOutroCurso() {
        Curso existente = Curso.builder().id(10L).nome("Curso Antigo").campus(campus()).grau(grau())
                .emailCoordenacao("antigo@ifrs.edu.br").cargaHorariaAcExigida(100).ativo(true).build();
        when(cursoRepository.findById(10L)).thenReturn(Optional.of(existente));
        when(cursoRepository.existsByEmailCoordenacaoAndIdNot("novo@ifrs.edu.br", 10L)).thenReturn(true);

        CursoUpdateRequest request = new CursoUpdateRequest("Curso Antigo", GRAU_ID, "novo@ifrs.edu.br", 100, null);

        assertThatThrownBy(() -> cursoService.atualizar(10L, request))
                .isInstanceOf(ResourceConflictException.class)
                .hasFieldOrPropertyWithValue("errorCode", "EMAIL_COORDENACAO_ALREADY_EXISTS");

        verify(cursoRepository, never()).save(any());
    }

    @Test
    void atualizar_deveAtualizarGrau() {
        Curso existente = Curso.builder().id(10L).nome("Curso Antigo").campus(campus()).grau(grau())
                .emailCoordenacao("antigo@ifrs.edu.br").cargaHorariaAcExigida(100).ativo(true).build();
        GrauCurso novoGrau = GrauCurso.builder().id(1L).nome("Tecnológico").build();
        when(cursoRepository.findById(10L)).thenReturn(Optional.of(existente));
        when(cursoRepository.existsByEmailCoordenacaoAndIdNot(any(), any())).thenReturn(false);
        when(grauCursoRepository.findById(1L)).thenReturn(Optional.of(novoGrau));
        when(cursoRepository.save(any(Curso.class))).thenAnswer(inv -> inv.getArgument(0));

        CursoUpdateRequest request = new CursoUpdateRequest("Curso Antigo", 1L, "antigo@ifrs.edu.br", 100, null);

        CursoResponse response = cursoService.atualizar(10L, request);

        assertThat(response.grauId()).isEqualTo(1L);
        assertThat(response.grauNome()).isEqualTo("Tecnológico");
    }
}
