package br.edu.ifrs.poa.hcomplementares.dto.request;

import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para avaliação de solicitação de horas complementares")
public record SolicitacaoAvaliacaoRequest(

    @Schema(description = "Horas deferidas", example = "30")
    @NotNull(message = "Horas deferidas e obrigatoria")
    @Max(value = 50, message = "Horas deferidas nao pode exceder horas solicitadas")
    Integer horasDeferidas,

    @Schema(description = "Status da avaliação", example = "DEFERIDO", implementation = RequestStatus.class)
    @NotNull(message = "Status e obrigatorio")
    RequestStatus status,

    @Schema(description = "Justificativa da coordenação", example = "Atividade dentro dos requisitos do projeto pedagógico.")
    @Size(max = 1000, message = "Justificativa deve ter no maximo 1000 caracteres")
    String observacao
) {}
