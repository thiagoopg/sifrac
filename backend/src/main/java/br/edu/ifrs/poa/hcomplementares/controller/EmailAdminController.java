package br.edu.ifrs.poa.hcomplementares.controller;

import br.edu.ifrs.poa.hcomplementares.dto.request.EmailTesteRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.EmailTesteResponse;
import br.edu.ifrs.poa.hcomplementares.service.EmailService;
import br.edu.ifrs.poa.hcomplementares.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "E-mail", description = "Validacao da configuracao de envio de e-mail")
@RestController
@RequestMapping("/api/v1/admin/email")
@RequiredArgsConstructor
public class EmailAdminController {

    private final EmailService emailService;
    private final UsuarioService usuarioService;

    @Operation(
            summary = "Enviar e-mail de teste",
            description = "Valida a configuracao SMTP enviando uma mensagem de teste. "
                    + "Envia mesmo com app.mail.enabled=false, para permitir a validacao "
                    + "antes de ligar o envio automatico. Se o destinatario nao for informado, "
                    + "usa o e-mail do administrador autenticado."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resultado do envio (sucesso ou falha)"),
            @ApiResponse(responseCode = "403", description = "Usuario sem permissao")
    })
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping("/teste")
    public ResponseEntity<EmailTesteResponse> enviarTeste(
            @Valid @RequestBody(required = false) EmailTesteRequest request,
            Authentication authentication) {

        String destinatario = request != null ? request.destinatario() : null;

        if (destinatario == null || destinatario.isBlank()) {
            destinatario = usuarioService
                    .buscarPorLoginLdap(authentication.getName())
                    .email();
        }

        return ResponseEntity.ok(
                emailService.enviarTeste(destinatario.trim())
        );
    }
}
