package br.edu.ifrs.poa.hcomplementares.repository;

import br.edu.ifrs.poa.hcomplementares.entity.Aluno;
import br.edu.ifrs.poa.hcomplementares.entity.TipoHoraComplementar;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Testes de integração das consultas de soma de horas, validando o escopo
 * das consultas (por tipo de atividade e por curso) contra os dados do seed.
 *
 * <p>Dados de referência do seed: aluno Thiago (TSI), tipo "Curso de Extensão"
 * com 40h DEFERIDAS e tipo "Participação em Eventos" com 20h PENDENTES.</p>
 */
@SpringBootTest
class SolicitacaoRepositoryTest {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private AlunoRepository alunoRepository;
    @Autowired
    private TipoHoraComplementarRepository tipoHoraComplementarRepository;

    private Long alunoId;
    private Long cursoId;
    private TipoHoraComplementar tipoComDeferidas;
    private TipoHoraComplementar tipoComPendentes;
    private TipoHoraComplementar tipoSemSolicitacoes;

    @BeforeEach
    void setUp() {
        Usuario usuario = usuarioRepository
                .findByLoginLdapAndAtivoTrue("thiagolima")
                .orElseThrow();

        Aluno aluno = alunoRepository
                .findByUsuarioId(usuario.getId())
                .orElseThrow();

        alunoId = aluno.getId();
        cursoId = aluno.getCurso().getId();

        tipoComDeferidas = tipoHoraComplementarRepository
                .findByCursoIdAndNome(cursoId, "Curso de Extensão")
                .orElseThrow();
        tipoComPendentes = tipoHoraComplementarRepository
                .findByCursoIdAndNome(cursoId, "Participação em Eventos")
                .orElseThrow();
        tipoSemSolicitacoes = tipoHoraComplementarRepository
                .findByCursoIdAndNome(cursoId, "Iniciação Científica")
                .orElseThrow();
    }

    @Test
    void somaHorasDeferidasPorAlunoETipo() {
        assertThat(solicitacaoRepository.sumHorasDeferidasByAlunoAndTipoHora(
                alunoId, tipoComDeferidas.getId()))
                .isEqualTo(40);
    }

    @Test
    void somaHorasPendentesPorAlunoETipo() {
        assertThat(solicitacaoRepository.sumHorasPendentesByAlunoAndTipoHora(
                alunoId, tipoComPendentes.getId()))
                .isEqualTo(20);
    }

    @Test
    void solicitacoesDeOutrosTiposNaoEntramNoLimiteDoTipoAtual() {
        // As 20h pendentes pertencem ao tipo "Participação em Eventos",
        // portanto NÃO contam para o tipo "Curso de Extensão".
        assertThat(solicitacaoRepository.sumHorasPendentesByAlunoAndTipoHora(
                alunoId, tipoComDeferidas.getId()))
                .isZero();
    }

    @Test
    void semSolicitacoesAnterioresRetornaZero() {
        assertThat(solicitacaoRepository.sumHorasDeferidasByAlunoAndTipoHora(
                alunoId, tipoSemSolicitacoes.getId()))
                .isZero();
        assertThat(solicitacaoRepository.sumHorasPendentesByAlunoAndTipoHora(
                alunoId, tipoSemSolicitacoes.getId()))
                .isZero();
    }

    @Test
    void somaHorasDeferidasPorAlunoECurso() {
        assertThat(solicitacaoRepository.sumHorasDeferidasByAlunoAndCurso(
                alunoId, cursoId))
                .isEqualTo(40);
    }

    @Test
    void horasDeOutrosTiposEntramNoTotalDoCurso() {
        // As 20h pendentes do tipo "Participação em Eventos" pertencem ao
        // mesmo aluno e curso, portanto entram no total do curso.
        assertThat(solicitacaoRepository.sumHorasPendentesByAlunoAndCurso(
                alunoId, cursoId))
                .isEqualTo(20);
    }
}
