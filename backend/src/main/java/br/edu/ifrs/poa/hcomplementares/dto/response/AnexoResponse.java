package br.edu.ifrs.poa.hcomplementares.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Dados de um anexo/certificado de solicitação")
public record AnexoResponse(
    @Schema(description = "Identificador do anexo", example = "1")
    Long id,

    @Schema(description = "Nome original do arquivo", example = "certificado_extensao.pdf")
    String nomeArquivo,

    @Schema(description = "URL para download do arquivo", example = "/uploads/certificado_extensao.pdf")
    String urlArquivo,

    @Schema(description = "Tamanho em bytes", example = "102400")
    Long tamanhoBytes
) {}
