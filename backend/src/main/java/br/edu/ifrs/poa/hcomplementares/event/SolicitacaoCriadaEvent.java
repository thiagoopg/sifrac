package br.edu.ifrs.poa.hcomplementares.event;

/**
 * Publicado apos a criacao de uma solicitacao de horas complementares.
 *
 * <p>O listener assincrono usa o identificador para recalcular as
 * pendencias do coordenador do curso e, se necessario, enviar o resumo
 * por e-mail.</p>
 */
public record SolicitacaoCriadaEvent(Long solicitacaoId) {
}
