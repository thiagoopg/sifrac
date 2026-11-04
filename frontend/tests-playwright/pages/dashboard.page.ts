import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * DashboardPage — estatísticas, cards, tabela de solicitações recentes.
 */
export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Elementos ──────────────────────────────────────────────────────────────

  private card(label: string) {
    return this.page.getByText(label, { exact: true }).locator('..').locator('..');
  }

  private get spinner() {
    return this.page.locator('.animate-spin');
  }

  // ── Assertions dashboard Admin/Campus/Coordenador ─────────────────────────

  async expectCardValue(label: string, expectedValue: string | number) {
    const cardEl = this.page.getByRole('heading', { level: 1 }).locator('..').locator('..');
    // Busca pelo label do card
    const cell = this.page.getByText(label, { exact: true }).locator('..').locator('..').locator('.text-3xl');
    await expect(cell).toHaveText(String(expectedValue));
  }

  /** Verifica que o título "Dashboard" está presente */
  async expectDashboardTitle() {
    await this.page.getByRole('heading', { name: 'Dashboard', level: 1 }).waitFor({ state: 'visible' });
  }

  /** Verifica que os 4 cards de estatísticas aparecem */
  async expectStatsCards() {
    await this.expectHidden(this.spinner);
    await this.page.locator('[data-testid="stat-total"]').waitFor({ state: 'visible' });
    await this.page.locator('[data-testid="stat-pendentes"]').waitFor({ state: 'visible' });
    await this.page.locator('[data-testid="stat-deferidas"]').waitFor({ state: 'visible' });
    await this.page.locator('[data-testid="stat-indeferidas"]').waitFor({ state: 'visible' });
  }

  /** Verifica que há uma tabela de solicitações recentes */
  async expectRecentTable() {
    const table = this.page.locator('table');
    await expect(table).toBeVisible();
  }

  /** Verifica que a mensagem "Nenhuma solicitação" aparece (aluno sem dados) */
  async expectEmptyTableMessage() {
    await this.page.getByText(/Nenhuma solicitação/i).waitFor({ state: 'visible' });
  }

  // ── Assertions Aluno (progresso de horas) ──────────────────────────────────

  async expectProgressSection() {
    // Barra de progresso visível com label "Progresso de Horas Complementares"
    await this.page.getByText('Progresso de Horas Complementares').waitFor({ state: 'visible' });
  }

  async expectProgressPercentage(expected: number) {
    await this.page.getByText(/concluído/).waitFor({ state: 'visible' });
    const text = await this.page.getByText(/concluído/).textContent();
    await expect(this.page.getByText(`${expected}%`)).toBeVisible();
  }

  // ── Navegação via Dashboard ────────────────────────────────────────────────

  async goToSolicitacoes() {
    const link = this.page.getByRole('link', { name: 'Ver todas as solicitações' });
    if (await link.count() > 0) {
      await link.click();
      await this.page.waitForURL(/\/solicitacoes/);
      return;
    }
    // Fallback: usa sidebar
    await this.page.getByRole('link', { name: 'Solicitações', exact: true }).click();
    await this.page.waitForURL(/\/solicitacoes/);
  }
}
