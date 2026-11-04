package br.edu.ifrs.poa.hcomplementares.dto.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resposta com dados do aluno")
public record AlunoResponse(
    @Schema(description = "Identificador único do aluno", example = "1")
    Long id,

    @Schema(description = "Matrícula do aluno", example = "20241PCA0001")
    String matricula,

    @Schema(description = "Nome do usuário/aluno", example = "João da Silva")
    String nomeUsuario,

    @Schema(description = "Email do usuário", example = "joao.silva@ifrs.edu.br")
    String emailUsuario,

    @Schema(description = "Nome do curso", example = "Analise e Desenvolvimento de Sistemas")
    String cursoNome,

    @Schema(description = "Data de criação do registro", example = "2024-09-11T10:00:00")
    LocalDateTime criadoEm
) {}
