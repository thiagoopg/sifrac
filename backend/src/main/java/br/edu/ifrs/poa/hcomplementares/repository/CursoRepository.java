package br.edu.ifrs.poa.hcomplementares.repository;

import br.edu.ifrs.poa.hcomplementares.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
    List<Curso> findByAtivoTrueOrderByNomeAsc();
    List<Curso> findByCampusId(Long campusId);
    Optional<Curso> findByNomeAndCampusId(String nome, Long campusId);
    Optional<Curso> findByCoordenadorId(Long coordenadorId);
    boolean existsByNomeAndCampusId(String nome, Long campusId);
    boolean existsByEmailCoordenacao(String emailCoordenacao);
    boolean existsByEmailCoordenacaoAndIdNot(String emailCoordenacao, Long id);
}
