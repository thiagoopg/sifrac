package br.edu.ifrs.poa.hcomplementares.repository;

import br.edu.ifrs.poa.hcomplementares.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Optional<Aluno> findByUsuarioId(Long usuarioId);
    Optional<Aluno> findByMatricula(String matricula);
    boolean existsByMatricula(String matricula);
    boolean existsByUsuarioId(Long usuarioId);
}
