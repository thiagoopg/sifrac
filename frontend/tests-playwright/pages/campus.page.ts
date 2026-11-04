import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * CampusPage — CRUD de campi.
 */
export class CampusPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Navegação ───────────────────────────────────────────────────────────────

  /** Apenas navega para /campus, sem esperas adicionais. */
  async irParaPaginaCampus() {
    await this.page.goto('/campus');
  }

  /** Reproduz a navegação usada antes de editar/excluir: tabela carregada + primeira linha. */
  async abrirListagemCampus() {
    await this.page.goto('/campus');
    await this.page.getByTestId('tabela-campus').waitFor();
    await this.page.locator('tbody tr').first().waitFor();
  }

  /** Reproduz a navegação usada no cadastro: aguarda o botão "Novo Campus". */
  async abrirPaginaParaCadastro() {
    await this.page.goto('/campus');
    await this.novoCampusButton().waitFor();
  }

  /** Reproduz a navegação usada na validação: aguarda o botão com data-testid. */
  async abrirPaginaParaValidacao() {
    await this.page.goto('/campus');
    await this.botaoNovoCampus().waitFor();
  }

  // ── Ações principais ───────────────────────────────────────────────────────

  novoCampusButton() {
    return this.page.getByRole('button', { name: 'Novo Campus' });
  }

  botaoNovoCampus() {
    return this.page.getByTestId('botao-novo-campus');
  }

  async clickNovoCampus() {
    await this.novoCampusButton().click();
  }

  async clickBotaoNovoCampus() {
    await this.botaoNovoCampus().click();
  }

  // ── Modal Create / Edit ────────────────────────────────────────────────────

  private modal() {
    return this.page.locator('.fixed.inset-0').filter({ hasText: /Novo Campus|Editar Campus/ });
  }

  public modalNomeInput() {
    return this.modal().locator('input[placeholder="Nome do campus"]');
  }

  private modalSiglaInput() {
    return this.modal().locator('input[placeholder="Sigla"]');
  }

  private modalCidadeInput() {
    return this.modal().locator('input[placeholder="Cidade"]');
  }

  private modalUfInput() {
    return this.modal().locator('input[placeholder="UF"]');
  }

  private modalAtivoCheckbox() {
    return this.modal().locator('input[type="checkbox"]');
  }

  private modalSalvarButton() {
    return this.modal().getByRole('button', { name: 'Salvar' });
  }

  private modalCancelarButton() {
    return this.modal().getByRole('button', { name: 'Cancelar' });
  }

  private modalErroText() {
    return this.modal().locator('.bg-red-50.text-red-600');
  }

  async openNewCampus() {
    await this.clickNovoCampus();
    await this.modal().waitFor({ state: 'visible' });
  }

  async preencherFormCampus(dados: { nome: string; sigla: string; cidade: string; uf: string; ativo?: boolean }) {
    await this.modalNomeInput().fill(dados.nome);
    await this.modalSiglaInput().fill(dados.sigla);
    await this.modalCidadeInput().fill(dados.cidade);
    await this.modalUfInput().fill(dados.uf);
    if (dados.ativo === false) {
      await this.modalAtivoCheckbox().uncheck();
    }
  }

  /** Input de nome do campus sem escopo de modal (mesmo seletor usado no fluxo de edição). */
  inputNomeCampus() {
    return this.page.getByPlaceholder('Nome do campus');
  }

  async preencherNomeCampus(nome: string) {
    await this.inputNomeCampus().fill(nome);
  }

  /**
   * Preenche os dados do novo campus com os mesmos seletores usados nos steps
   * (placeholders no escopo da página, na mesma ordem do formulário).
   */
  async preencherDadosNovoCampus(dados: { nome: string; sigla: string; cidade: string; uf: string }) {
    await this.page.getByPlaceholder('Nome do campus').fill(dados.nome);
    await this.page.getByPlaceholder('Sigla').fill(dados.sigla);
    await this.page.getByPlaceholder('Cidade').fill(dados.cidade);
    await this.page.getByPlaceholder('UF').fill(dados.uf);
  }

  async clickModalSalvar() {
    await this.modalSalvarButton().click();
  }

  async clickModalCancelar() {
    await this.modalCancelarButton().click();
  }

  async expectFormError(msg?: string) {
    await this.expectVisible(this.modalErroText().locator('..'));
    if (msg) {
      await expect(this.modalErroText()).toContainText(msg);
    }
  }

  // ── Botões de ação por linha ───────────────────────────────────────────────

  editButton(nomeCampus: string) {
    // Botão Pencil na linha do campus
    return this.page.locator('tbody tr').filter({ hasText: nomeCampus }).first()
      .locator('button').filter({ has: this.page.locator('[data-icon="pencil"]') }).first();
  }

  deleteButton(nomeCampus: string) {
    return this.page.locator('tbody tr').filter({ hasText: nomeCampus }).first()
      .locator('button').filter({ has: this.page.locator('[data-icon="trash-2"]') }).first();
  }

  async clickEditCampus(nomeCampus: string) {
    await this.editButton(nomeCampus).click();
  }

  async clickDeleteCampus(nomeCampus: string) {
    await this.deleteButton(nomeCampus).click();
  }

  // ── Ações sobre a primeira linha da tabela ─────────────────────────────────

  /** Nome (coluna 2) da primeira linha da listagem. */
  async getNomeDaPrimeiraLinha() {
    return (await this.page.locator('tbody tr').first().locator('td').nth(1).innerText()).trim();
  }

  async clickEditarPrimeiraLinha() {
    await this.page.locator('tbody tr').first().locator('button[data-testid^="edit-campus-"]').click();
  }

  /** Aguarda o botão de edição de campus estar visível na listagem. */
  async expectBotaoEditarVisivel() {
    await this.page.locator('button[data-testid^="edit-campus-"]').first().waitFor({ state: 'visible' });
  }

  async clickExcluirPrimeiraLinha() {
    await this.page.locator('tbody tr').first().locator('button[data-testid^="delete-campus-"]').click();
  }

  /** Botão "Confirmar" do overlay de exclusão (sem filtro de título do modal). */
  async confirmarExclusao() {
    await this.page.locator('.fixed.inset-0').getByRole('button', { name: 'Confirmar' }).click();
  }

  // ── Modal Delete Confirmation ─────────────────────────────────────────────

  deleteConfirmButton() {
    return this.page.locator('.fixed.inset-0').filter({ hasText: 'Confirmar exclusão' })
      .getByRole('button', { name: 'Confirmar' });
  }

  deleteCancelButton() {
    return this.page.locator('.fixed.inset-0').filter({ hasText: 'Confirmar exclusão' })
      .getByRole('button', { name: 'Cancel' });
  }

  async expectDeleteModalOpen() {
    await this.page.locator('.fixed.inset-0').filter({ hasText: 'Confirmar exclusão' }).waitFor({ state: 'visible' });
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

  /** Verifica o status (Ativo/Inativo) de uma linha */
  async expectRowStatus(nome: string, esperado: 'Ativo' | 'Inativo') {
    const row = this.page.locator('tbody tr').filter({ hasText: nome }).first();
    await expect(row.getByText(esperado, { exact: true })).toBeVisible();
  }

  // ── Assertions usadas nos steps ────────────────────────────────────────────

  /** Modal de cadastro/edição de campus fechado. */
  async expectModalCampusFechado() {
    await expect(this.page.getByRole('heading', { name: /Novo Campus|Editar Campus/ })).toBeHidden();
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

  /**
   * Mensagens de validação genéricas do formulário.
   * Step compartilhado por campus/cursos/tipos-hora/solicitações.
   */
  async expectMensagensDeValidacaoVisiveis() {
    await expect(this.page.locator('.bg-red-50.text-red-600').first()).toBeVisible();
  }
}
