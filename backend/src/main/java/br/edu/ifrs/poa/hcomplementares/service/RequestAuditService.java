package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.dto.response.RequestAuditResponse;
import br.edu.ifrs.poa.hcomplementares.entity.RequestAudit;
import br.edu.ifrs.poa.hcomplementares.entity.SolicitacaoHoraComplementar;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.repository.RequestAuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RequestAuditService {

    private final RequestAuditRepository requestAuditRepository;

    @Transactional
    public void registrar(SolicitacaoHoraComplementar solicitacao, Usuario usuario,
                          String acao, String statusAnterior, String statusNovo, String descricao) {
        RequestAudit audit = RequestAudit.builder()
                .solicitacao(solicitacao)
                .usuario(usuario)
                .acao(acao)
                .statusAnterior(statusAnterior)
                .statusNovo(statusNovo)
                .descricao(descricao)
                .build();
        requestAuditRepository.save(audit);
    }

    public List<RequestAuditResponse> listarPorSolicitacao(Long solicitacaoId) {
        return requestAuditRepository.findBySolicitacaoIdOrderByCriadoEmDesc(solicitacaoId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<RequestAuditResponse> listarPorUsuario(Long usuarioId) {
        return requestAuditRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private RequestAuditResponse toResponse(RequestAudit a) {
        return new RequestAuditResponse(
                a.getId(),
                a.getSolicitacao().getId(),
                a.getUsuario().getId(),
                a.getUsuario().getNome(),
                a.getAcao(),
                a.getStatusAnterior(),
                a.getStatusNovo(),
                a.getDescricao(),
                a.getCriadoEm()
        );
    }
}
