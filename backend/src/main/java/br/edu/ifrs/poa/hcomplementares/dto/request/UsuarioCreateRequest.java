package br.edu.ifrs.poa.hcomplementares.dto.request;

import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para registro de usuário no sistema")
public record UsuarioCreateRequest(
    @Schema(description = "Nome completo do usuário", example = "João da Silva")
    @NotBlank(message = "Nome e obrigatorio")
    @Size(min = 3, max = 150, message = "Nome deve ter entre 3 e 150 caracteres")
    String nome,

    @Schema(description = "Email do usuário", example = "joao.silva@ifrs.edu.br")
    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    @Size(max = 150, message = "Email deve ter no maximo 150 caracteres")
    String email,

    @Schema(description = "Login LDAP do usuário", example = "joao.silva")
    @NotBlank(message = "Login LDAP e obrigatorio")
    @Size(min = 3, max = 100, message = "Login LDAP deve ter entre 3 e 100 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Login LDAP deve conter apenas letras, numeros, pontos, tracos e underscores")
    String loginLdap,

    @Schema(description = "Perfil de acesso do usuário", example = "COORDENADOR")
    @NotNull(message = "Perfil e obrigatorio")
    UserProfile perfil,

    @Schema(description = "ID do campus (obrigatório para ADMIN_CAMPUS)", example = "1")
    Long campusId
) {}
