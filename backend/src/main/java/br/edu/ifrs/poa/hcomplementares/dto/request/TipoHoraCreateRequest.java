package br.edu.ifrs.poa.hcomplementares.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para cadastro de tipo de hora complementar")
public record TipoHoraCreateRequest(
    @Schema(description = "Nome do tipo de hora", example = "Monitoria")
    @NotBlank(message = "Nome e obrigatorio")
    @Size(min = 3, max = 150, message = "Nome deve ter entre 3 e 150 caracteres")
    String nome,

    @Schema(description = "Descrição do tipo", example = "Atividade de monitoria acadêmica")
    @Size(max = 500, message = "Descricao deve ter no maximo 500 caracteres")
    String descricao,

    @Schema(description = "Carga horária máxima permitida", example = "120")
    @NotNull(message = "Carga horaria maxima e obrigatoria")
    @Positive(message = "Carga horaria maxima deve ser positiva")
    Integer cargaHorariaMaxima,

    @Schema(description = "ID do curso", example = "1")
    @NotNull(message = "ID do curso e obrigatorio")
    Long cursoId
) {}
