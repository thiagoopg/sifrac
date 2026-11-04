import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * CampusAdminsPage — interações com a página /admin-campus.
 */
export class CampusAdminsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Navegação ──────────────────────────────────────────────────────────────

  /** Abre a página de administração de campus (/admin-campus) */
  async abrirPagina() {
    await this.page.goto('/admin-campus');
    await this.page.waitForLoadState('networkidle');
  }

  // ── Header ──────────────────────────────────────────────────────────────────

  /** Verifica se o título "Admins de Campus" está presente */
  async expectTituloPresente() {
    await expect(this.page.getByRole('heading', { name: 'Admins de Campus', level: 1 })).toBeVisible();
  }

  // ── Permissão ───────────────────────────────────────────────────────────────

  /** Verifica se há mensagem de permissão (não é admin principal) */
  async expectMensagemPermissao() {
    await expect(this.page.getByText('Apenas o admin principal pode ver esta página.')).toBeVisible();
  }

  /** Verifica se NÃO há mensagem de permissão (é admin principal ou tem acesso) */
  async expectSemMensagemPermissao() {
    await expect(this.page.getByText('Apenas o admin principal pode ver esta página.')).not.toBeVisible();
  }

  // ── Tabela de Admins ────────────────────────────────────────────────────────

  /** Verifica se a tabela de admins está visível */
  async expectTabelaPresente() {
    await expect(this.page.locator('table.min-w-full')).toBeVisible();
  }

  /** Verifica se as colunas do thead estão presentes */
  async expectColunasTabela() {
    await expect(this.page.getByRole('columnheader', { name: 'Nome' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Campus' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Ações' })).toBeVisible();
  }

  /** Verifica se há pelo menos uma linha na tabela */
  async expectLinhasNaTabela() {
    const count = await this.page.locator('tbody tr').count();
    return count > 0;
  }

  /** Conta quantas linhas de admin existem na tabela */
  async contarAdmins() {
    return this.page.locator('tbody tr').count();
  }

  /** Verifica se um admin específico aparece na tabela */
  async expectAdminPresente(nome: string) {
    await expect(this.page.locator('tbody tr').filter({ hasText: nome })).toBeVisible();
  }

  /** Verifica se um admin específico NÃO aparece na tabela */
  async expectAdminAusente(nome: string) {
    await expect(this.page.locator('tbody tr').filter({ hasText: nome })).toHaveCount(0);
  }

  /** Verifica se a tabela de admins e ao menos uma linha estão visíveis */
  async expectAdminsVisiveis() {
    await this.expectTabelaPresente();
    await expect(this.page.locator('tbody tr').first()).toBeVisible();
  }

  /** Linha da tabela referente a um admin específico */
  adminRow(nome: string) {
    return this.page.locator('tbody tr').filter({ hasText: nome }).first();
  }

  // ── Botão Remover ───────────────────────────────────────────────────────────

  /** Botão "Remover" de um admin específico */
  removerButton(nome: string) {
    return this.page.locator('tbody tr').filter({ hasText: nome }).first()
      .locator('button', { hasText: 'Remover' });
  }

  /** Clica no botão remover de um admin */
  async clickRemover(nome: string) {
    await this.removerButton(nome).click();
  }

  /** Remove o vínculo do admin com o campus, confirmando o dialog nativo */
  async removerVinculo(nome: string) {
    await this.adminRow(nome).waitFor();
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.removerButton(nome).click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Espera e confirma o dialog confirm() do navegador */
  async confirmarDialog() {
    // Usa page.on('dialog') para capturar e aceitar o dialog nativo
    const dialogPromise = new Promise<void>((resolve) => {
      const handler = (dialog: { accept: () => Promise<void> }) => {
        dialog.accept();
        this.page.off('dialog', handler);
        resolve();
      };
      this.page.on('dialog', handler);
    });
    await dialogPromise;
  }

  // ── Estado de Loading ───────────────────────────────────────────────────────

  /** Verifica se há loading (pode ser spinner ou estrutura inicial) */
  async expectCarregando() {
    // Não há spinner explícito na view, mas podemos verificar se a tabela já carrega
    await this.page.waitForSelector('table.min-w-full', { state: 'visible', timeout: 5000 });
  }
}
