package br.edu.ifrs.poa.hcomplementares.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Resposta com dados da notificação")
public record NotificacaoResponse(
    @Schema(description = "Identificador único", example = "1")
    Long id,

    @Schema(description = "ID do usuário destinatário", example = "3")
    Long usuarioId,

    @Schema(description = "Título da notificação", example = "Solicitação aprovada")
    String titulo,

    @Schema(description = "Mensagem da notificação", example = "Sua solicitação de Curso de Extensao foi aprovada.")
    String mensagem,

    @Schema(description = "Indica se foi lida", example = "false")
    Boolean lida,

    @Schema(description = "ID da solicitação vinculada", example = "1")
    Long solicitacaoId,

    @Schema(description = "Data de criação", example = "2024-09-15T10:00:00")
    LocalDateTime criadoEm
) {}
