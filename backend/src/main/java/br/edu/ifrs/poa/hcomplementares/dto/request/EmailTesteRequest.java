package br.edu.ifrs.poa.hcomplementares.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para envio de e-mail de teste de configuracao SMTP")
public record EmailTesteRequest(

        @Schema(
                description = "Destinatario do teste. Se vazio, usa o e-mail do administrador autenticado.",
                example = "2024009471@aluno.poa.ifrs.edu.br"
        )
        @Email(message = "Destinatario deve ser um e-mail valido")
        @Size(max = 150, message = "Destinatario deve ter no maximo 150 caracteres")
        String destinatario
) {
}
