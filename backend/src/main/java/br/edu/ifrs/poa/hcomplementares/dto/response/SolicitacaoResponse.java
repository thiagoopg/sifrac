package br.edu.ifrs.poa.hcomplementares.dto.response;

import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Resposta com dados da solicitação de horas complementares")
public record SolicitacaoResponse(
    @Schema(description = "Identificador único da solicitação", example = "1")
    Long id,

    @Schema(description = "Matrícula do aluno", example = "20241PCA0001")
    String matriculaAluno,

    @Schema(description = "Nome do aluno", example = "João da Silva")
    String nomeAluno,

    @Schema(description = "Nome do curso", example = "Analise e Desenvolvimento de Sistemas")
    String cursoNome,

    @Schema(description = "Nome do tipo de hora", example = "Monitoria")
    String tipoHoraNome,

    @Schema(description = "Título da solicitação", example = "Curso de Extensão em Java")
    String titulo,

    @Schema(description = "Horas solicitadas", example = "30")
    Integer horasSolicitadas,

    @Schema(description = "Horas deferidas pelo coordenador", example = "30")
    Integer horasDeferidas,

    @Schema(description = "Status da solicitação", example = "APROVADO")
    RequestStatus status,

    @Schema(description = "Justificativa da coordenação", example = "Atividade dentro dos requisitos.")
    String justificativaCoordenador,

    @Schema(description = "ID do coordenador que avaliou", example = "2")
    Long coordenadorId,

    @Schema(description = "Nome do coordenador avaliador", example = "Maria Souza")
    String coordenadorNome,

    @Schema(description = "Data da solicitação", example = "2024-09-11T10:00:00")
    LocalDateTime dataSolicitacao,

    @Schema(description = "Data da avaliação", example = "2024-09-12T14:30:00")
    LocalDateTime dataAvaliacao,

    @Schema(description = "Lista de anexos/certificados")
    List<AnexoResponse> anexos
) {}
