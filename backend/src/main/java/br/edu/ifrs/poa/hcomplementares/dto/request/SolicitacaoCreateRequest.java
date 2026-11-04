package br.edu.ifrs.poa.hcomplementares.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Dados para cadastro de solicitação de horas complementares")
public record SolicitacaoCreateRequest(
    @Schema(description = "ID do tipo de hora complementar", example = "1")
    @NotNull(message = "ID do tipo de hora e obrigatorio")
    Long tipoHoraId,

    @Schema(description = "Título da solicitação", example = "Curso de extensão")
    String titulo,

    @Schema(description = "Quantidade de horas solicitadas", example = "30")
    @NotNull(message = "Horas solicitadas e obrigatoria")
    @Min(value = 1, message = "Horas solicitadas deve ser pelo menos 1")
    Integer horasSolicitadas
) {}
