package br.edu.ifrs.poa.hcomplementares.repository;

import br.edu.ifrs.poa.hcomplementares.entity.GrauCurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrauCursoRepository extends JpaRepository<GrauCurso, Long> {
    Optional<GrauCurso> findByNome(String nome);
    boolean existsByNome(String nome);
    List<GrauCurso> findByAtivoTrueOrderByNomeAsc();
}
