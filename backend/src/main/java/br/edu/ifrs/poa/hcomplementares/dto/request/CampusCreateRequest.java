package br.edu.ifrs.poa.hcomplementares.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para cadastro de campus")
public record CampusCreateRequest(
    @Schema(description = "Nome do campus", example = "Porto Alegre")
    @NotBlank(message = "Nome e obrigatoria")
    @Size(min = 3, max = 120, message = "Nome deve ter entre 3 e 120 caracteres")
    String nome,

    @Schema(description = "Sigla do campus", example = "POA")
    @NotBlank(message = "Sigla e obrigatoria")
    @Size(min = 2, max = 10, message = "Sigla deve ter entre 2 e 10 caracteres")
    @Pattern(regexp = "^[A-Z]{2,10}$", message = "Sigla deve conter apenas letras maiusculas")
    String sigla,

    @Schema(description = "Cidade do campus", example = "Porto Alegre")
    @NotBlank(message = "Cidade e obrigatoria")
    @Size(max = 80, message = "Cidade deve ter no maximo 80 caracteres")
    String cidade,

    @Schema(description = "UF do campus", example = "RS")
    @NotBlank(message = "UF e obrigatoria")
    @Pattern(regexp = "^[A-Z]{2}$", message = "UF deve ter 2 letras maiusculas")
    String uf
) {}
