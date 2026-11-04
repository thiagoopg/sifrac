import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * AlunosPage — listagem de alunos (somente ADMINISTRADOR).
 */
export class AlunosPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Navegação ──────────────────────────────────────────────────────────────

  /** Abre a página de alunos e espera o campo de busca estar disponível */
  async abrirPagina() {
    await this.page.goto('/alunos');
    await this.buscaInput().waitFor();
  }

  // ── Pesquisa ───────────────────────────────────────────────────────────────

  /** Campo de busca de alunos */
  buscaInput() {
    return this.page.locator('[data-testid="input-busca-aluno"]');
  }

  /** Preenche o campo de busca com o termo informado */
  async pesquisar(termo: string) {
    await this.buscaInput().fill(termo);
  }

  /** Nome (primeira coluna) do primeiro aluno listado */
  async nomePrimeiroAluno() {
    const texto = await this.page.locator('tbody tr').first().locator('td').first().innerText();
    return texto.split('\n')[0].trim();
  }

  // ── Ações ──────────────────────────────────────────────────────────────────

  novoAlunoButton() {
    return this.page.getByRole('button', { name: 'Novo Aluno' });
  }

  async clickNovoAluno() {
    await this.novoAlunoButton().click();
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

  /** Verifica se a coluna com matrícula existe (teste de renderização) */
  async expectMatriculaColumnVisible() {
    await this.page.locator('th').filter({ hasText: 'Matrícula' }).waitFor({ state: 'visible' });
  }

  // ── Assertions de listagem ─────────────────────────────────────────────────

  /** Verifica que existe ao menos um aluno cadastrado na listagem */
  async expectAlunosCadastrados() {
    await this.expectPrimeiraLinhaVisivel();
  }

  /** Verifica que os dados do aluno estão visíveis na listagem */
  async expectInformacoesAluno() {
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
