package br.edu.ifrs.poa.hcomplementares.repository;

import br.edu.ifrs.poa.hcomplementares.entity.TipoHoraComplementar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TipoHoraComplementarRepository extends JpaRepository<TipoHoraComplementar, Long> {
    List<TipoHoraComplementar> findByCursoId(Long cursoId);
    List<TipoHoraComplementar> findByCursoCampusId(Long campusId);
    Optional<TipoHoraComplementar> findByCursoIdAndNome(Long cursoId, String nome);
    boolean existsByCursoIdAndNome(Long cursoId, String nome);

    @Query("SELECT SUM(s.horasDeferidas) FROM TipoHoraComplementar t JOIN t.solicitacoes s WHERE t.id = :tipoId AND s.status = 'DEFERIDO'")
    Integer sumHorasDeferredasByTipoId(Long tipoId);
}
