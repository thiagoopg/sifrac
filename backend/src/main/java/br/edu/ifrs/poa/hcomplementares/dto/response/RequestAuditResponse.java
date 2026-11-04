package br.edu.ifrs.poa.hcomplementares.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Registro de auditoria de solicitação")
public record RequestAuditResponse(
    @Schema(description = "ID do registro de auditoria", example = "1")
    Long id,

    @Schema(description = "ID da solicitação auditada", example = "1")
    Long solicitacaoId,

    @Schema(description = "ID do usuário que realizou a ação", example = "2")
    Long usuarioId,

    @Schema(description = "Nome do usuário que realizou a ação", example = "Marcelo Augusto Rauh Schmitt")
    String usuarioNome,

    @Schema(description = "Tipo da ação realizada", example = "AVALIACAO")
    String acao,

    @Schema(description = "Status anterior antes da ação", example = "PENDENTE")
    String statusAnterior,

    @Schema(description = "Novo status após a ação", example = "DEFERIDO")
    String statusNovo,

    @Schema(description = "Descrição/justificativa da ação", example = "Atividade dentro dos requisitos do projeto pedagógico.")
    String descricao,

    @Schema(description = "Data/hora da ação", example = "2024-09-12T14:30:00")
    LocalDateTime criadoEm
) {}
