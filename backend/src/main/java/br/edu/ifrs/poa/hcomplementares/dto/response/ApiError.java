package br.edu.ifrs.poa.hcomplementares.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Erros da API")
public record ApiError(
    @Schema(description = "Código do erro", example = "VALIDATION_FAILED")
    String errorCode,

    @Schema(description = "Mensagem de erro", example = "Falha na validacao. Verifique os campos sinalizados.")
    String message,

    @Schema(description = "Código HTTP", example = "400")
    int status,

    @Schema(description = "Data/hora do erro", example = "2024-09-11T10:00:00")
    java.time.Instant timestamp,

    @Schema(description = "URI da requisição", example = "/api/v1/alunos")
    String path,

    @Schema(description = "Lista de erros de campo")
    java.util.List<FieldError> fieldErrors
) {
    @Schema(description = "Erro de validação de campo")
    public record FieldError(
        String field,
        Object rejectedValue,
        String message
    ) {}
}
