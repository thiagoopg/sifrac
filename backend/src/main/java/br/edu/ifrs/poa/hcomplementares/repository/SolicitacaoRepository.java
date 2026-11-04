package br.edu.ifrs.poa.hcomplementares.repository;

import br.edu.ifrs.poa.hcomplementares.entity.SolicitacaoHoraComplementar;
import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<SolicitacaoHoraComplementar, Long> {

    interface PendenciaPorCurso {
        String getCursoNome();
        Long getQuantidade();
    }
    List<SolicitacaoHoraComplementar> findByAlunoIdOrderByDataSolicitacaoDesc(Long alunoId);
    List<SolicitacaoHoraComplementar> findByStatusOrderByDataSolicitacaoDesc(RequestStatus status);
    List<SolicitacaoHoraComplementar> findByAlunoIdAndStatusOrderByDataSolicitacaoDesc(Long alunoId, RequestStatus status);

    @Query("SELECT s FROM SolicitacaoHoraComplementar s WHERE s.aluno.curso.id = :cursoId ORDER BY s.dataSolicitacao DESC")
    List<SolicitacaoHoraComplementar> findByCursoIdOrderByDataSolicitacaoDesc(Long cursoId);

    @Query("SELECT s FROM SolicitacaoHoraComplementar s WHERE s.aluno.curso.campus.id = :campusId ORDER BY s.dataSolicitacao DESC")
    List<SolicitacaoHoraComplementar> findByCampusIdOrderByDataSolicitacaoDesc(Long campusId);

    @Query("SELECT s FROM SolicitacaoHoraComplementar s LEFT JOIN FETCH s.anexos")
    List<SolicitacaoHoraComplementar> findAllWithAnexos();

    @Query("SELECT s FROM SolicitacaoHoraComplementar s LEFT JOIN FETCH s.anexos WHERE s.id = :id")
    java.util.Optional<SolicitacaoHoraComplementar> findByIdWithAnexos(Long id);

    @Query("SELECT s FROM SolicitacaoHoraComplementar s LEFT JOIN FETCH s.anexos WHERE s.aluno.id = :alunoId ORDER BY s.dataSolicitacao DESC")
    List<SolicitacaoHoraComplementar> findByAlunoIdOrderByDataSolicitacaoDescWithAnexos(Long alunoId);

    @Query("SELECT s FROM SolicitacaoHoraComplementar s LEFT JOIN FETCH s.anexos WHERE s.status = :status ORDER BY s.dataSolicitacao DESC")
    List<SolicitacaoHoraComplementar> findByStatusOrderByDataSolicitacaoDescWithAnexos(RequestStatus status);

    @Query("SELECT s FROM SolicitacaoHoraComplementar s LEFT JOIN FETCH s.anexos WHERE s.aluno.curso.id = :cursoId ORDER BY s.dataSolicitacao DESC")
    List<SolicitacaoHoraComplementar> findByCursoIdOrderByDataSolicitacaoDescWithAnexos(Long cursoId);

    @Query("SELECT s FROM SolicitacaoHoraComplementar s LEFT JOIN FETCH s.anexos WHERE s.aluno.curso.campus.id = :campusId ORDER BY s.dataSolicitacao DESC")
    List<SolicitacaoHoraComplementar> findByCampusIdOrderByDataSolicitacaoDescWithAnexos(Long campusId);

    @Query("SELECT COALESCE(SUM(s.horasDeferidas), 0) FROM SolicitacaoHoraComplementar s " +
            "WHERE s.aluno.id = :alunoId AND s.tipoHora.id = :tipoHoraId AND s.status = 'DEFERIDO'")
    Integer sumHorasDeferidasByAlunoAndTipoHora(Long alunoId, Long tipoHoraId);

    @Query("SELECT COALESCE(SUM(s.horasSolicitadas), 0) FROM SolicitacaoHoraComplementar s " +
            "WHERE s.aluno.id = :alunoId AND s.tipoHora.id = :tipoHoraId AND s.status = 'PENDENTE'")
    Integer sumHorasPendentesByAlunoAndTipoHora(Long alunoId, Long tipoHoraId);

    @Query("SELECT COALESCE(SUM(s.horasDeferidas), 0) FROM SolicitacaoHoraComplementar s " +
            "WHERE s.aluno.id = :alunoId AND s.aluno.curso.id = :cursoId AND s.status = 'DEFERIDO'")
    Integer sumHorasDeferidasByAlunoAndCurso(Long alunoId, Long cursoId);

    @Query("SELECT COALESCE(SUM(s.horasSolicitadas), 0) FROM SolicitacaoHoraComplementar s " +
            "WHERE s.aluno.id = :alunoId AND s.aluno.curso.id = :cursoId AND s.status = 'PENDENTE'")
    Integer sumHorasPendentesByAlunoAndCurso(Long alunoId, Long cursoId);

    @Query("SELECT c.nome AS cursoNome, COUNT(s) AS quantidade " +
            "FROM SolicitacaoHoraComplementar s " +
            "JOIN s.aluno a " +
            "JOIN a.curso c " +
            "WHERE s.status = :status AND c.coordenador.id = :coordenadorId " +
            "GROUP BY c.id, c.nome " +
            "ORDER BY c.nome")
    List<PendenciaPorCurso> contarPendenciasPorCursoDoCoordenador(
            @Param("coordenadorId") Long coordenadorId,
            @Param("status") RequestStatus status);
}
