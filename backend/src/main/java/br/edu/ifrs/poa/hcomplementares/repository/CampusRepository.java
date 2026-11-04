package br.edu.ifrs.poa.hcomplementares.repository;

import br.edu.ifrs.poa.hcomplementares.entity.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CampusRepository extends JpaRepository<Campus, Long> {
    Optional<Campus> findBySigla(String sigla);
    boolean existsBySigla(String sigla);
}
