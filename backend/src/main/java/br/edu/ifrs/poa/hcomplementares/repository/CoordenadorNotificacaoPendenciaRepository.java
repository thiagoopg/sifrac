package br.edu.ifrs.poa.hcomplementares.repository;

import br.edu.ifrs.poa.hcomplementares.entity.CoordenadorNotificacaoPendencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface CoordenadorNotificacaoPendenciaRepository
        extends JpaRepository<CoordenadorNotificacaoPendencia, Long> {

    Optional<CoordenadorNotificacaoPendencia>
    findFirstByCoordenadorIdOrderByDataReferenciaDesc(Long coordenadorId);

    Optional<CoordenadorNotificacaoPendencia>
    findByCoordenadorIdAndDataReferencia(Long coordenadorId, LocalDate dataReferencia);
}
