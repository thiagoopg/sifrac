package br.edu.ifrs.poa.hcomplementares.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Resposta com dados do curso")
public record CursoResponse(
    @Schema(description = "Identificador único do curso", example = "1")
    Long id,

    @Schema(description = "ID do campus vinculado", example = "1")
    Long campusId,

    @Schema(description = "Nome do curso", example = "Analise e Desenvolvimento de Sistemas")
    String nome,

    @Schema(description = "Nome do campus", example = "Porto Alegre")
    String campusNome,

    @Schema(description = "Sigla do campus", example = "POA")
    String campusSigla,

    @Schema(description = "ID do grau do curso", example = "3")
    Long grauId,

    @Schema(description = "Nome do grau do curso", example = "Bacharelado")
    String grauNome,

    @Schema(description = "Email da coordenação", example = "ads@poa.ifrs.edu.br")
    String emailCoordenacao,

    @Schema(description = "Carga horária de AC exigida", example = "45")
    Integer cargaHorariaAcExigida,

    @Schema(description = "ID do coordenador", example = "2")
    Long coordenadorId,

    @Schema(description = "Nome do coordenador", example = "Maria Souza")
    String coordenadorNome,

    @Schema(description = "Indica se o curso está ativo", example = "true")
    boolean ativo,

    @Schema(description = "Data de criação", example = "2024-01-01T00:00:00")
    LocalDateTime criadoEm
) {}
