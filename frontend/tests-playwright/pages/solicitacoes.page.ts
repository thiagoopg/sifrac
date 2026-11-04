import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * SolicitacoesPage — listar, filtrar, avaliar, criar e cancelar solicitações.
 */
export class SolicitacoesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Navegação ──────────────────────────────────────────────────────────────

  /** Abre a listagem de solicitações e espera a tabela estar carregada */
  async abrirPagina() {
    await this.page.goto('/solicitacoes');
    await this.page.locator('table').waitFor();
  }

  /** Overlay (modal) identificado pelo texto informado */
  private modal(titulo: string) {
    return this.page.locator('.fixed.inset-0').filter({ hasText: titulo });
  }

  // ── Filtros de status ─────────────────────────────────────────────────────

  filterStatus(status: string) {
    return this.page.getByRole('button', { name: status, exact: true });
  }

  async clickFilterAll() {
    await this.filterStatus('Todos').click();
  }

  async clickFilterPendentes() {
    await this.filterStatus('Pendentes').click();
  }

  async clickFilterDeferidas() {
    await this.filterStatus('Deferidas').click();
  }

  async clickFilterIndeferidas() {
    await this.filterStatus('Indeferidas').click();
  }

  // ── Botões de ação na tabela ───────────────────────────────────────────────

  /** Botão "Nova Solicitação" (visível apenas para ALUNO) */
  novaSolicitacaoButton() {
    return this.page.getByRole('button', { name: 'Nova Solicitação' });
  }

  /** Clica no botão "Nova Solicitação" */
  async clickNovaSolicitacao() {
    await this.novaSolicitacaoButton().click();
  }

  /** Botão de avaliar (CheckCircle) em uma linha específica */
  avaliacaoButton(rowName: string) {
    // Encontra a linha pelo nome do aluno e clica no botão de avaliação dentro dela
    const row = this.page.locator('tbody tr').filter({ hasText: rowName }).first();
    return row.locator('button').filter({ has: this.page.locator('[data-icon="check-circle"]') }).first();
  }

  /** Botão de cancelar (Trash2) em uma linha específica */
  cancelarButton(rowName: string) {
    const row = this.page.locator('tbody tr').filter({ hasText: rowName }).first();
    return row.locator('button').filter({ has: this.page.locator('[data-icon="trash-2"]') }).first();
  }

  /** Link "Ver histórico" em uma linha específica */
  verHistoricoLink(rowName: string) {
    const row = this.page.locator('tbody tr').filter({ hasText: rowName }).first();
    return row.getByTestId('ver-historico');
  }

  // ── Histórico (auditoria) ───────────────────────────────────────────────────

  /**
   * Abre o histórico de auditoria de uma solicitação.
   * Sem `status`, prioriza uma solicitação já avaliada (Deferido/Indeferido)
   * e, não havendo nenhuma, usa a primeira da listagem.
   */
  async abrirHistorico(status?: string) {
    await this.abrirPagina();

    const linhas = this.page.locator('tbody tr');
    let alvo;
    if (status) {
      alvo = linhas.filter({ hasText: status }).first();
    } else {
      const avaliadas = linhas.filter({ hasText: /Deferido|Indeferido/ });
      alvo = (await avaliadas.count()) > 0 ? avaliadas.first() : linhas.first();
    }

    await alvo.getByTestId('ver-historico').click();
    await this.page.waitForURL(/\/audit/);
  }

  /** Abre o histórico de auditoria da primeira solicitação da listagem */
  async abrirHistoricoDaPrimeiraSolicitacao() {
    await this.abrirPagina();
    await this.page.locator('tbody tr').first().getByTestId('ver-historico').click();
    await this.page.waitForURL(/\/audit/);
  }

  // ── Modal Avaliação ────────────────────────────────────────────────────────

  async expectAvaliacaoModalOpen() {
    await this.modal('Avaliar Solicitação').waitFor({ state: 'visible' });
  }

  /** Verifica se o modal de avaliação foi fechado */
  async expectAvaliacaoModalClosed() {
    await expect(this.page.getByRole('heading', { name: 'Avaliar Solicitação' })).toBeHidden();
  }

  avaliacaoStatusSelect() {
    return this.modal('Avaliar Solicitação').locator('select').first();
  }

  avaliacaoHorasInput() {
    return this.modal('Avaliar Solicitação').locator('input[type="number"]').first();
  }

  avaliacaoJustificativaTextarea() {
    return this.modal('Avaliar Solicitação').locator('textarea').first();
  }

  avaliacaoConfirmarButton() {
    return this.modal('Avaliar Solicitação').getByRole('button', { name: 'Confirmar' });
  }

  avaliacaoCancelarButton() {
    return this.modal('Avaliar Solicitação').getByRole('button', { name: 'Cancelar' });
  }

  avaliacaoErrorText() {
    return this.page.locator('.fixed.inset-0 .bg-red-50.text-red-600').first();
  }

  async preencherAvaliacao(status: 'DEFERIDO' | 'INDEFERIDO', horas?: number, justificativa?: string) {
    await this.avaliacaoStatusSelect().selectOption(status);
    if (status === 'DEFERIDO' && horas !== undefined) {
      await this.avaliacaoHorasInput().fill(String(horas));
    }
    if (status === 'INDEFERIDO' && justificativa) {
      await this.avaliacaoJustificativaTextarea().fill(justificativa);
    }
  }

  async clickAvaliacaoConfirmar() {
    await this.avaliacaoConfirmarButton().click();
  }

  async clickAvaliacaoCancelar() {
    await this.avaliacaoCancelarButton().click();
  }

  /**
   * Abre o modal de avaliação da primeira solicitação pendente,
   * clicando em "Deferir" ou "Indeferir" conforme o status informado.
   */
  async abrirAvaliacao(status: 'DEFERIDO' | 'INDEFERIDO') {
    await this.abrirPagina();

    const linha = this.page.locator('tbody tr').filter({ hasText: 'Pendente' }).first();
    const botao = status === 'DEFERIDO' ? 'button[title="Deferir"]' : 'button[title="Indeferir"]';
    await linha.locator(botao).click();

    await this.expectAvaliacaoModalOpen();
  }

  // ── Modal Nova Solicitação (ALUNO) ────────────────────────────────────────

  async expectNovaSolicitacaoModalOpen() {
    await this.modal('Nova Solicitação').waitFor({ state: 'visible' });
  }

  /** Verifica se o modal de nova solicitação foi fechado */
  async expectNovaSolicitacaoModalClosed() {
    await expect(this.page.getByRole('heading', { name: 'Nova Solicitação' })).toBeHidden();
  }

  novaSolicitacaoTituloInput() {
    return this.modal('Nova Solicitação').locator('input[type="text"]').first();
  }

  novaSolicitacaoTipoSelect() {
    return this.modal('Nova Solicitação').locator('select').first();
  }

  novaSolicitacaoHorasInput() {
    return this.modal('Nova Solicitação').locator('input[type="number"]').first();
  }

  novaSolicitacaoArquivoInput() {
    return this.modal('Nova Solicitação').locator('input[type="file"]').first();
  }

  novaSolicitacaoSolicitarButton() {
    return this.modal('Nova Solicitação').getByRole('button', { name: 'Solicitar' });
  }

  novaSolicitacaoCancelarButton() {
    return this.modal('Nova Solicitação').getByRole('button', { name: 'Cancelar' });
  }

  novaSolicitacaoErrorText() {
    return this.page.locator('.fixed.inset-0 .bg-red-50.text-red-600').nth(1);
  }

  /** Verifica se há mensagem de erro (validação) visível dentro de um modal */
  async expectMensagemErroVisivel() {
    await expect(this.page.locator('.fixed.inset-0 .bg-red-50.text-red-600').first()).toBeVisible();
  }

  async preencherNovaSolicitacao(titulo: string, horas: number) {
    await this.novaSolicitacaoTituloInput().fill(titulo);
    await this.novaSolicitacaoHorasInput().fill(String(horas));
  }

  /** Seleciona o tipo de hora complementar no modal de nova solicitação */
  async selecionarTipoHora(tipoHora: string) {
    const select = this.novaSolicitacaoTipoSelect();
    await select.waitFor({ state: 'visible' });
    // Aguarda pelo menos uma opção não-vazia aparecer
    await this.page.waitForFunction(
      (sel) => {
        const el = document.querySelector(sel) as HTMLSelectElement | null;
        if (!el) return false;
        return Array.from(el.options).some((o) => (o.text || '').trim() !== '' && !o.disabled);
      },
      'select',
      { timeout: 10000 },
    );
    // Tenta pelo label; se não existir, pega a primeira opção habilitada
    const options = await select.locator('option:not([disabled])').all();
    if (options.length > 0) {
      const texts = await Promise.all(options.map(async (o) => (await o.textContent()) ?? ''));
      const idx = texts.findIndex((t) => t.includes(tipoHora));
      if (idx >= 0) {
        const value = await options[idx].getAttribute('value');
        await select.selectOption(value ?? { label: texts[idx] });
        return;
      }
      const value = await options[0].getAttribute('value');
      await select.selectOption(value ?? { index: 0 });
      return;
    }
    // Fallback: tenta pelo label diretamente
    await select.selectOption({ label: tipoHora });
  }

  async clickNovaSolicitacaoSolicitar() {
    await this.novaSolicitacaoSolicitarButton().click();
  }

  async clickNovaSolicitacaoCancelar() {
    await this.novaSolicitacaoCancelarButton().click();
  }

  // ── Modal Visualizar Anexo ─────────────────────────────────────────────────

  async expectAnexoModalOpen() {
    await this.modal('Visualizar Anexo').waitFor({ state: 'visible' });
  }

  anexoCloseButton() {
    return this.modal('Visualizar Anexo').locator('button').first();
  }

  async closeAnexoModal() {
    await this.anexoCloseButton().click();
  }

  // ── Assertions de tabela ───────────────────────────────────────────────────

  /** Conta quantas linhas a tabela de solicitações tem (exclui header) */
  async contarLinhasTabela() {
    return this.page.locator('tbody tr').count();
  }

  /** Verifica se uma linha com o nome do aluno existe */
  async expectRowExists(nomeAluno: string) {
    await this.page.locator('tbody tr').filter({ hasText: nomeAluno }).first().waitFor({ state: 'visible' });
  }

  /** Verifica se uma linha com o nome do aluno NÃO existe (filtrou corretamente) */
  async expectRowNotExists(nomeAluno: string) {
    await this.page.locator('tbody tr').filter({ hasText: nomeAluno }).first().waitFor({ state: 'hidden', timeout: 5000 });
  }

  /** Verifica se o botão "Nova Solicitação" está visível (somente ALUNO) */
  async expectNovaSolicitacaoButtonVisible() {
    await this.novaSolicitacaoButton().waitFor({ state: 'visible' });
  }

  /** Verifica se o botão "Nova Solicitação" NÃO está visível (não é ALUNO) */
  async expectNovaSolicitacaoButtonHidden() {
    await this.page.getByRole('button', { name: 'Nova Solicitação' }).waitFor({ state: 'hidden', timeout: 5000 });
  }

  /** Verifica se botões de avaliar aparecem (somente COORDENADOR em linhas PENDENTE) */
  async expectAvaliarButtonsVisible() {
    // Botões Deferir/Indeferir visíveis em linhas PENDENTE
    await this.page.locator('button[title="Deferir"]').first().waitFor({ state: 'visible', timeout: 5000 });
  }

  async expectAvaliarButtonsHidden() {
    await this.page.locator('button[title="Deferir"]').first().waitFor({ state: 'hidden', timeout: 5000 });
  }

  /** Verifica se as opções de avaliação (Deferir/Indeferir) NÃO estão presentes */
  async expectOpcoesAvaliacaoAusentes() {
    await expect(this.page.locator('button[title="Deferir"]')).toHaveCount(0);
    await expect(this.page.locator('button[title="Indeferir"]')).toHaveCount(0);
  }

  /** Verifica se a listagem possui ao menos uma linha visível */
  async expectPrimeiraLinhaVisivel() {
    await expect(this.page.locator('tbody tr').first()).toBeVisible();
  }

  /** Verifica se todas as linhas listadas contêm o texto informado */
  async expectTodasLinhasContem(texto: string) {
    const linhas = this.page.locator('tbody tr');
    const total = await linhas.count();
    for (let i = 0; i < total; i++) {
      await expect(linhas.nth(i)).toContainText(texto);
    }
  }

  /** Verifica se a linha que contém o texto informado existe e traz o status esperado */
  async expectLinhaComTextoEStatus(texto: string, status: string) {
    const linha = this.page.locator('tbody tr').filter({ hasText: texto }).first();
    await expect(linha).toBeVisible();
    await expect(linha).toContainText(status);
  }

  /** Verifica se existe alguma linha com o status informado (Deferido/Indeferido) */
  async expectLinhaAvaliadaVisivel() {
    await expect(this.page.locator('tbody tr').filter({ hasText: /Deferido|Indeferido/ }).first()).toBeVisible();
  }

  /** Verifica se existe alguma linha deferida */
  async expectLinhaDeferidaVisivel() {
    await expect(this.page.locator('tbody tr').filter({ hasText: 'Deferido' }).first()).toBeVisible();
  }

  /** Verifica se existe alguma linha indeferida */
  async expectLinhaIndeferidaVisivel() {
    await expect(this.page.locator('tbody tr').filter({ hasText: 'Indeferido' }).first()).toBeVisible();
  }

  /** Verifica se a primeira linha traz um status válido (Pendente/Deferido/Indeferido/Cancelado) */
  async expectStatusValidoNaListagem() {
    await expect(this.page.locator('tbody tr').first()).toContainText(/Pendente|Deferido|Indeferido|Cancelado/);
  }
}
