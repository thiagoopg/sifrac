package br.edu.ifrs.poa.hcomplementares.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resposta com dados do grau de curso")
public record GrauCursoResponse(
    @Schema(description = "Identificador único do grau", example = "3")
    Long id,

    @Schema(description = "Nome do grau", example = "Bacharelado")
    String nome,

    @Schema(description = "Descrição do grau", example = "Curso de bacharelado pleno")
    String descricao
) {}
