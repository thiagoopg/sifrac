package br.edu.ifrs.poa.hcomplementares.dto.response;

import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Resposta com dados do usuário")
public record UsuarioResponse(
    @Schema(description = "Identificador único do usuário", example = "1")
    Long id,

    @Schema(description = "Nome completo", example = "João da Silva")
    String nome,

    @Schema(description = "Email", example = "joao.silva@ifrs.edu.br")
    String email,

    @Schema(description = "Login LDAP", example = "joao.silva")
    String loginLdap,

    @Schema(description = "Perfil de acesso", example = "COORDENADOR")
    UserProfile perfil,

    @Schema(description = "Indica se o usuário está ativo", example = "true")
    boolean ativo,

    @Schema(description = "Data de criação", example = "2024-01-01T00:00:00")
    LocalDateTime criadoEm,

    @Schema(description = "ID do campus (null para admin principal)", example = "1")
    Long campusId,

    @Schema(description = "Nome do campus (null para admin principal)", example = "Porto Alegre")
    String campusNome,

    @Schema(description = "ID do curso (null para admin)", example = "2")
    Long cursoId,

    @Schema(description = "Nome do curso (null para admin)", example = "Tecnologia em Análise e Desenvolvimento de Sistemas")
    String cursoNome
) {}
