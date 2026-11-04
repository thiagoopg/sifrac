package br.edu.ifrs.poa.hcomplementares.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resultado do envio de e-mail de teste")
public record EmailTesteResponse(

        @Schema(description = "Indica se o envio foi aceito pelo servidor SMTP", example = "true")
        boolean sucesso,

        @Schema(description = "Mensagem descritiva do resultado")
        String mensagem,

        @Schema(description = "Destinatario utilizado no teste", example = "2024009471@aluno.poa.ifrs.edu.br")
        String destinatario
) {
}
