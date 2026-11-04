package br.edu.ifrs.poa.hcomplementares.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Resposta com dados do tipo de hora complementar")
public record TipoHoraResponse(
    @Schema(description = "Identificador único do tipo", example = "1")
    Long id,

    @Schema(description = "Nome do tipo", example = "Monitoria")
    String nome,

    @Schema(description = "Descrição do tipo", example = "Atividade de monitoria acadêmica")
    String descricao,

    @Schema(description = "Carga horária máxima permitida", example = "120")
    Integer cargaHorariaMaxima,

    @Schema(description = "Nome do curso vinculado", example = "Analise e Desenvolvimento de Sistemas")
    String cursoNome,

    @Schema(description = "ID do curso vinculado", example = "1")
    Long cursoId,

    @Schema(description = "Indica se o tipo está ativo", example = "true")
    boolean ativo,

    @Schema(description = "Data de criação", example = "2024-01-01T00:00:00")
    LocalDateTime criadoEm
) {}
