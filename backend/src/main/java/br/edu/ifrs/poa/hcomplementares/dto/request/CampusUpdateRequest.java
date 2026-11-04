package br.edu.ifrs.poa.hcomplementares.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para atualização de campus")
public record CampusUpdateRequest(
    @Schema(description = "Nome do campus", example = "Porto Alegre")
    @Size(min = 3, max = 120, message = "Nome deve ter entre 3 e 120 caracteres")
    String nome,

    @Schema(description = "Sigla do campus", example = "POA")
    @Size(min = 2, max = 10, message = "Sigla deve ter entre 2 e 10 caracteres")
    String sigla,

    @Schema(description = "Cidade do campus", example = "Porto Alegre")
    @Size(max = 80, message = "Cidade deve ter no maximo 80 caracteres")
    String cidade,

    @Schema(description = "UF do campus", example = "RS")
    String uf
) {}
