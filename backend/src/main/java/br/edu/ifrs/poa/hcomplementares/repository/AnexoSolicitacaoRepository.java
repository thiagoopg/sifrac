package br.edu.ifrs.poa.hcomplementares.repository;

import br.edu.ifrs.poa.hcomplementares.entity.AnexoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnexoSolicitacaoRepository extends JpaRepository<AnexoSolicitacao, Long> {
    List<AnexoSolicitacao> findBySolicitacaoIdOrderByEnviadoEmDesc(Long solicitacaoId);
    boolean existsBySolicitacaoId(Long solicitacaoId);
}
