package br.edu.ifrs.poa.hcomplementares.controller;

import br.edu.ifrs.poa.hcomplementares.dto.response.RequestAuditResponse;
import br.edu.ifrs.poa.hcomplementares.service.RequestAuditService;
import br.edu.ifrs.poa.hcomplementares.service.SolicitacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "Auditoria de Solicitações",
        description = "Log de auditoria imutável de ações em solicitações de horas complementares"
)
@RestController
@RequestMapping("/api/v1/solicitacoes/{solicitacaoId}/audit")
@RequiredArgsConstructor
public class RequestAuditController {

    private final RequestAuditService requestAuditService;
    private final SolicitacaoService solicitacaoService;

    @Operation(
            summary = "Listar histórico de auditoria de uma solicitação",
            description = "Retorna o log completo de todas as ações realizadas na solicitação, ordenadas da mais recente para a mais antiga"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Histórico recuperado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Solicitação não encontrada"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<RequestAuditResponse>> listar(@PathVariable Long solicitacaoId) {
        solicitacaoService.buscarPorId(solicitacaoId);
        return ResponseEntity.ok(requestAuditService.listarPorSolicitacao(solicitacaoId));
    }
}