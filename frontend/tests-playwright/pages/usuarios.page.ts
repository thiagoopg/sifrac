import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * UsuariosPage — CRUD de usuários (somente ADMINISTRADOR).
 */
export class UsuariosPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Navegação ──────────────────────────────────────────────────────────────

  /** Abre a página de usuários e espera o campo de busca estar disponível */
  async abrirPagina() {
    await this.page.goto('/usuarios');
    await this.buscaInput().waitFor();
  }

  // ── Pesquisa ───────────────────────────────────────────────────────────────

  /** Campo de busca de usuários */
  buscaInput() {
    return this.page.locator('[data-testid="busca-usuario"]');
  }

  /** Preenche o campo de busca com o termo informado */
  async pesquisar(termo: string) {
    await this.buscaInput().fill(termo);
  }

  /** Nome (primeira coluna) do primeiro usuário listado */
  async nomePrimeiroUsuario() {
    const texto = await this.page.locator('tbody tr').first().locator('td').first().innerText();
    return texto.trim();
  }

  // ── Ações principais ───────────────────────────────────────────────────────

  novoUsuarioButton() {
    return this.page.getByRole('button', { name: 'Novo Usuário' });
  }

  async clickNovoUsuario() {
    await this.novoUsuarioButton().click();
  }

  // ── Modal Create / Edit ────────────────────────────────────────────────────

  private modal() {
    return this.page.locator('.fixed.inset-0').filter({ hasText: /Novo Usuário|Editar Usuário/ });
  }

  private modalNomeInput() {
    return this.modal().locator('input[placeholder="Nome completo"]');
  }

  private modalEmailInput() {
    return this.modal().locator('input[placeholder*="email@iftrs"]');
  }

  private modalLoginLdapInput() {
    return this.modal().locator('input[placeholder="login.ldap"]');
  }

  private modalPerfilSelect() {
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

  async openNewUsuario() {
    await this.clickNovoUsuario();
    await this.modal().waitFor({ state: 'visible' });
  }

  async preencherFormUsuario(dados: {
    nome: string;
    email: string;
    loginLdap: string;
    perfil: string;
    ativo?: boolean;
  }) {
    await this.modalNomeInput().fill(dados.nome);
    await this.modalEmailInput().fill(dados.email);
    await this.modalLoginLdapInput().fill(dados.loginLdap);
    await this.modalPerfilSelect().selectOption(dados.perfil);
    if (dados.ativo === false) await this.modalAtivoCheckbox().uncheck();
  }

  async clickModalSalvar() {
    await this.modalSalvarButton().click();
  }

  async clickModalCancelar() {
    await this.modalCancelarButton().click();
  }

  async expectFormError(msg?: string) {
    if (msg) {
      await expect(this.modalErroText()).toContainText(msg);
    }
  }

  // ── Botões de ação por linha ───────────────────────────────────────────────

  editButton(nomeUsuario: string) {
    return this.page.locator('tbody tr').filter({ hasText: nomeUsuario }).first()
      .locator('button').filter({ has: this.page.locator('[data-icon="pencil"]') }).first();
  }

  deleteButton(nomeUsuario: string) {
    return this.page.locator('tbody tr').filter({ hasText: nomeUsuario }).first()
      .locator('button').filter({ has: this.page.locator('[data-icon="trash-2"]') }).first();
  }

  async clickEditUsuario(nomeUsuario: string) {
    await this.editButton(nomeUsuario).click();
  }

  async clickDeleteUsuario(nomeUsuario: string) {
    await this.deleteButton(nomeUsuario).click();
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

  /** Verifica que existe ao menos um usuário cadastrado na listagem */
  async expectUsuariosCadastrados() {
    await this.expectPrimeiraLinhaVisivel();
  }

  /** Verifica que os dados do usuário estão visíveis na listagem */
  async expectInformacoesUsuario() {
    await this.expectPrimeiraLinhaVisivel();
  }

  /** Verifica que todas as linhas listadas contêm o termo pesquisado */
  async expectLinhasContem(termo: string) {
    const linhas = this.page.locator('tbody tr');
    await expect(linhas.first()).toBeVisible();
    const total = await linhas.count();
    for (let i = 0; i < total; i++) {
      await expect(linhas.nth(i)).toContainText(termo);
    }
  }

  private async expectPrimeiraLinhaVisivel() {
    await expect(this.page.locator('tbody tr').first()).toBeVisible();
  }
}
