package br.edu.ifrs.poa.hcomplementares.event;

import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;

public record SolicitacaoAvaliadaEvent(
        Long solicitacaoId,
        String alunoEmail,
        String alunoNome,
        String solicitacaoTitulo,
        RequestStatus novoStatus,
        Integer horasSolicitadas,
        Integer horasDeferidas,
        String justificativaCoordenador,
        String cursoNome,
        String tipoHoraNome,
        String coordenadorNome
) {
}
