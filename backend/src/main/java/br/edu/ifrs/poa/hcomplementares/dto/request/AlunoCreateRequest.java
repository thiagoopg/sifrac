package br.edu.ifrs.poa.hcomplementares.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para cadastro de aluno")
public record AlunoCreateRequest(
    @Schema(description = "Matrícula do aluno", example = "20241PCA0001")
    @NotBlank(message = "Matricula e obrigatoria")
    @Size(min = 1, max = 30, message = "Matricula deve ter no maximo 30 caracteres")
    String matricula,

    @Schema(description = "ID do usuário vinculado", example = "1")
    @NotNull(message = "ID do usuario e obrigatorio")
    Long usuarioId,

    @Schema(description = "ID do curso do aluno", example = "1")
    @NotNull(message = "ID do curso e obrigatorio")
    Long cursoId
) {}
