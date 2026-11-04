package br.edu.ifrs.poa.hcomplementares.repository;

import br.edu.ifrs.poa.hcomplementares.entity.RequestAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestAuditRepository extends JpaRepository<RequestAudit, Long> {
    List<RequestAudit> findBySolicitacaoIdOrderByCriadoEmDesc(Long solicitacaoId);
    List<RequestAudit> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);
}
