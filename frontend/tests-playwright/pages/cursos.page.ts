import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * CursosPage — CRUD de cursos com selects de campus e coordenadores.
 */
export class CursosPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Navegação ───────────────────────────────────────────────────────────────

  /** Reproduz a navegação da listagem: botão "Novo Curso" + primeira linha. */
  async abrirPaginaCursos() {
    await this.page.goto('/cursos');
    await this.novoCursoButton().waitFor();
    await this.page.locator('tbody tr').first().waitFor();
  }

  // ── Ações principais ───────────────────────────────────────────────────────

  novoCursoButton() {
    return this.page.getByRole('button', { name: 'Novo Curso' });
  }

  async clickNovoCurso() {
    await this.novoCursoButton().click();
  }

  // ── Modal Create / Edit ────────────────────────────────────────────────────

  private modal() {
    return this.page.locator('.fixed.inset-0').filter({ hasText: /Novo Curso|Editar Curso/ });
  }

  private modalNomeInput() {
    return this.modal().locator('input[placeholder*="Tecnologia"]');
  }

  private modalCampusSelect() {
    return this.modal().locator('select').first();
  }

  private modalEmailInput() {
    return this.modal().locator('input[placeholder*="exemplo@"]');
  }

  private modalCargaHorariaInput() {
    return this.modal().locator('input[placeholder="Ex: 180"]');
  }

  private modalCoordenadorSelect() {
    return this.modal().locator('select').nth(1);
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

  async openNewCurso() {
    await this.clickNovoCurso();
    await this.modal().waitFor({ state: 'visible' });
  }

  async preencherFormCurso(dados: {
    nome: string;
    campusId?: string;
    email: string;
    cargaHoraria: number;
    coordenadorId?: string;
    ativo?: boolean;
  }) {
    await this.modalNomeInput().fill(dados.nome);
    if (dados.campusId) await this.modalCampusSelect().selectOption(dados.campusId);
    await this.modalEmailInput().fill(dados.email);
    await this.modalCargaHorariaInput().fill(String(dados.cargaHoraria));
    if (dados.coordenadorId) await this.modalCoordenadorSelect().selectOption(dados.coordenadorId);
    if (dados.ativo === false) await this.modalAtivoCheckbox().uncheck();
  }

  async clickModalSalvar() {
    await this.modalSalvarButton().click();
  }

  async clickModalCancelar() {
    await this.modalCancelarButton().click();
  }

  /**
   * Preenche o formulário de novo curso com os seletores usados nos steps:
   * nome (1º input de texto), campus, grau, e-mail da coordenação e carga horária.
   */
  async preencherNovoCurso(nome: string) {
    await this.modal().locator('input[type="text"]').first().fill(nome);
    await this.modal().locator('[data-testid="select-campus"]').selectOption({ index: 1 });
    await this.modal().locator('[data-testid="select-grau"]').selectOption({ index: 1 });
    const sufixo = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    await this.modal().locator('input[type="email"]').fill(`coordenacao.${sufixo}@ifrs.edu.br`);
    await this.modal().locator('input[type="number"]').fill('120');
  }

  /** Renomeia o curso no modal de edição (1º input de texto do modal). */
  async preencherNomeCurso(nome: string) {
    await this.modal().locator('input[type="text"]').first().fill(nome);
  }

  async expectFormError(msg?: string) {
    if (msg) {
      await expect(this.modalErroText()).toContainText(msg);
    }
  }

  // ── Botões de ação por linha ───────────────────────────────────────────────

  editButton(nomeCurso: string) {
    return this.page.locator('tbody tr').filter({ hasText: nomeCurso }).first()
      .locator('button').filter({ has: this.page.locator('[data-icon="pencil"]') }).first();
  }

  deleteButton(nomeCurso: string) {
    return this.page.locator('tbody tr').filter({ hasText: nomeCurso }).first()
      .locator('button').filter({ has: this.page.locator('[data-icon="trash-2"]') }).first();
  }

  async clickEditCurso(nomeCurso: string) {
    await this.editButton(nomeCurso).click();
  }

  async clickDeleteCurso(nomeCurso: string) {
    await this.deleteButton(nomeCurso).click();
  }

  // ── Ações sobre a primeira linha da tabela ─────────────────────────────────

  /** Nome (coluna 1) da primeira linha da listagem. */
  async getNomeDaPrimeiraLinha() {
    return (await this.page.locator('tbody tr').first().locator('td').nth(0).innerText()).trim();
  }

  async clickEditarPrimeiraLinha() {
    await this.page.locator('tbody tr').first().locator('button[data-testid^="edit-curso-"]').click();
  }

  async clickExcluirPrimeiraLinha() {
    await this.page.locator('tbody tr').first().locator('button[data-testid^="delete-curso-"]').click();
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

  /** Modal de cadastro/edição de curso fechado. */
  async expectModalCursoFechado() {
    await expect(this.page.getByRole('heading', { name: /Novo Curso|Editar Curso/ })).toBeHidden();
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
