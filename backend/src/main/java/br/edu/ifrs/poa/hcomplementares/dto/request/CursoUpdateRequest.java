package br.edu.ifrs.poa.hcomplementares.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para atualização de curso")
public record CursoUpdateRequest(
    @Schema(description = "Nome do curso", example = "Analise e Desenvolvimento de Sistemas")
    @Size(min = 3, max = 150, message = "Nome deve ter entre 3 e 150 caracteres")
    String nome,

    @Schema(description = "ID do grau do curso", example = "3")
    @NotNull(message = "Grau e obrigatorio")
    Long grauId,

    @Schema(description = "Email da coordenação", example = "ads@poa.ifrs.edu.br")
    @Email(message = "Email invalido")
    String emailCoordenacao,

    @Schema(description = "Carga horária de AC exigida", example = "45")
    @NotNull(message = "Carga horaria AC exigida e obrigatoria")
    Integer cargaHorariaAcExigida,

    @Schema(description = "ID do coordenador do curso", example = "1")
    Long coordenadorId
) {}
