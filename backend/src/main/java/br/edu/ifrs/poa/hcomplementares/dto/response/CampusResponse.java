package br.edu.ifrs.poa.hcomplementares.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Resposta com dados do campus")
public record CampusResponse(
    @Schema(description = "Identificador único do campus", example = "1")
    Long id,

    @Schema(description = "Nome do campus", example = "Porto Alegre")
    String nome,

    @Schema(description = "Sigla do campus", example = "POA")
    String sigla,

    @Schema(description = "Cidade do campus", example = "Porto Alegre")
    String cidade,

    @Schema(description = "UF do campus", example = "RS")
    String uf,

    @Schema(description = "Indica se o campus está ativo", example = "true")
    boolean ativo,

    @Schema(description = "Data de criação", example = "2024-01-01T00:00:00")
    LocalDateTime criadoEm
) {}
