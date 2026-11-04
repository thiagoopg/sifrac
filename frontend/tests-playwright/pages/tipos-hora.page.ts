import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * TiposHoraPage — CRUD de tipos de hora complementar.
 */
export class TiposHoraPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Navegação ───────────────────────────────────────────────────────────────

  /** Reproduz a navegação da listagem: botão "Novo Tipo" + primeira linha. */
  async abrirPaginaTiposHora() {
    await this.page.goto('/tipos-hora');
    await this.botaoNovoTipo().waitFor();
    await this.page.locator('tbody tr').first().waitFor();
  }

  // ── Ações principais ───────────────────────────────────────────────────────

  novoTipoButton() {
    return this.page.getByRole('button', { name: 'Novo Tipo' });
  }

  botaoNovoTipo() {
    return this.page.locator('[data-testid="botao-novo-tipo"]');
  }

  async clickNovoTipo() {
    await this.novoTipoButton().click();
  }

  async clickBotaoNovoTipo() {
    await this.botaoNovoTipo().click();
  }

  // ── Modal Create / Edit ────────────────────────────────────────────────────

  private modal() {
    return this.page.locator('.fixed.inset-0').filter({ hasText: /Novo Tipo de Hora|Editar Tipo de Hora/ });
  }

  private modalNomeInput() {
    return this.modal().locator('input[placeholder="Ex: Monitoria"]');
  }

  private modalDescricaoTextarea() {
    return this.modal().locator('textarea');
  }

  private modalCargaHorariaInput() {
    return this.modal().locator('input[placeholder="Ex: 120"]');
  }

  private modalCursoSelect() {
    return this.modal().locator('select');
  }

  private modalAtivoCheckbox() {
    return this.modal().locator('input[type="checkbox"]');
  }

  private modalSalvarButton() {
    return this.modal().getByRole('button', { name: /Salvar/ });
  }

  private modalCancelarButton() {
    return this.modal().getByRole('button', { name: 'Cancelar' });
  }

  private modalErroText() {
    return this.modal().locator('.bg-red-50.text-red-600');
  }

  async openNewTipo() {
    await this.clickNovoTipo();
    await this.modal().waitFor({ state: 'visible' });
  }

  async preencherFormTipo(dados: { nome: string; descricao?: string; cargaHoraria: number; cursoId?: string; ativo?: boolean }) {
    await this.modalNomeInput().fill(dados.nome);
    if (dados.descricao) await this.modalDescricaoTextarea().fill(dados.descricao);
    await this.modalCargaHorariaInput().fill(String(dados.cargaHoraria));
    if (dados.cursoId) await this.modalCursoSelect().selectOption(dados.cursoId);
    if (dados.ativo === false) await this.modalAtivoCheckbox().uncheck();
  }

  async clickModalSalvar() {
    await this.modalSalvarButton().click();
  }

  async clickModalCancelar() {
    await this.modalCancelarButton().click();
  }

  /**
   * Preenche o formulário de novo tipo de hora com os seletores usados nos steps:
   * nome, carga horária e (se habilitado) o primeiro select do modal.
   */
  async preencherTipoHora(nome: string) {
    await this.modal().locator('[data-testid="input-nome-tipo"]').fill(nome);
    await this.modal().locator('input[type="number"]').first().fill('60');
    const sel = this.modal().locator('select').first();
    if (await sel.isEnabled()) {
      await sel.selectOption({ index: 1 });
    }
  }

  /** Renomeia o tipo de hora no modal de edição. */
  async preencherNomeTipoHora(nome: string) {
    await this.modal().locator('[data-testid="input-nome-tipo"]').fill(nome);
  }

  async expectFormError(msg?: string) {
    if (msg) {
      await expect(this.modalErroText()).toContainText(msg);
    }
  }

  // ── Botões de ação por linha ───────────────────────────────────────────────

  editButton(nomeTipo: string) {
    return this.page.locator('tbody tr').filter({ hasText: nomeTipo }).first()
      .locator('button').filter({ has: this.page.locator('[data-icon="pencil"]') }).first();
  }

  deleteButton(nomeTipo: string) {
    return this.page.locator('tbody tr').filter({ hasText: nomeTipo }).first()
      .locator('button').filter({ has: this.page.locator('[data-icon="trash-2"]') }).first();
  }

  async clickEditTipo(nomeTipo: string) {
    await this.editButton(nomeTipo).click();
  }

  async clickDeleteTipo(nomeTipo: string) {
    await this.deleteButton(nomeTipo).click();
  }

  // ── Ações sobre a primeira linha da tabela ─────────────────────────────────

  /** Nome (coluna 1) da primeira linha da listagem. */
  async getNomeDaPrimeiraLinha() {
    return (await this.page.locator('tbody tr').first().locator('td').nth(0).innerText()).trim();
  }

  async clickEditarPrimeiraLinha() {
    await this.page.locator('tbody tr').first().locator('button[data-testid^="edit-tipo-"]').click();
  }

  async clickExcluirPrimeiraLinha() {
    await this.page.locator('tbody tr').first().locator('button[data-testid^="delete-tipo-"]').click();
  }

  /** Botão "Confirmar" do overlay de desativação (sem filtro de título do modal). */
  async confirmarExclusao() {
    await this.page.locator('.fixed.inset-0').getByRole('button', { name: 'Confirmar' }).click();
  }

  // ── Modal Delete Confirmation ─────────────────────────────────────────────

  deleteConfirmButton() {
    return this.page.locator('.fixed.inset-0').filter({ hasText: 'Confirmar desativação' })
      .getByRole('button', { name: 'Confirmar' });
  }

  deleteCancelButton() {
    return this.page.locator('.fixed.inset-0').filter({ hasText: 'Confirmar desativação' })
      .getByRole('button', { name: 'Cancel' });
  }

  async expectDeleteModalOpen() {
    await this.page.locator('.fixed.inset-0').filter({ hasText: 'Confirmar desativação' }).waitFor({ state: 'visible' });
  }

  async clickDeleteConfirm() {
    await this.deleteConfirmButton().click();
  }

  async clickDeleteCancel() {
    await this.deleteCancelButton().click();
  }

  // ── Assertions de tabela ───────────────────────────────────────────────────

  async contarLinhasTabela() {
    return this.page.locator('tbody tr').count();
  }

  async expectRowExists(nome: string) {
    await this.page.locator('tbody tr').filter({ hasText: nome }).first().waitFor({ state: 'visible' });
  }

  async expectRowNotExists(nome: string) {
    await this.page.locator('tbody tr').filter({ hasText: nome }).first().waitFor({ state: 'hidden', timeout: 5000 });
  }

  // ── Assertions usadas nos steps ────────────────────────────────────────────

  /** Modal de cadastro/edição de tipo de hora fechado. */
  async expectModalTipoHoraFechado() {
    await expect(this.page.getByRole('heading', { name: /Novo Tipo de Hora|Editar Tipo de Hora/ })).toBeHidden();
  }

  async expectPrimeiraLinhaVisivel() {
    await expect(this.page.locator('tbody tr').first()).toBeVisible();
  }

  async expectLinhaVisivel(nome: string) {
    await expect(this.page.locator('tbody tr').filter({ hasText: nome })).toBeVisible();
  }

  async expectLinhaAusente(nome: string) {
    await expect(this.page.locator('tbody tr').filter({ hasText: nome })).toHaveCount(0);
  }
}
