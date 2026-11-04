import { Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * LayoutPage — Sidebar, header, notificações, perfil e logout.
 * Reutilizado por TODOS os testes que precisam navegar pela app logada.
 */
export class LayoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Sidebar ────────────────────────────────────────────────────────────────

  private sidebarLink(label: string) {
    // Router-links contêm ícone SVG + texto, usar getByText no span dentro do aside
    return this.page.locator('aside').getByText(label, { exact: true });
  }

  async clickDashboard() {
    await this.sidebarLink('Dashboard').click();
    await this.page.waitForURL(/\/dashboard/);
  }

  async clickCampus() {
    await this.sidebarLink('Campus').click();
    await this.page.waitForURL(/\/campus/);
  }

  async clickCursos() {
    await this.sidebarLink('Cursos').click();
    await this.page.waitForURL(/\/cursos/);
  }

  async clickAlunos() {
    await this.sidebarLink('Alunos').click();
    await this.page.waitForURL(/\/alunos/);
  }

  async clickSolicitacoes() {
    await this.sidebarLink('Solicitações').click();
    await this.page.waitForURL(/\/solicitacoes/);
  }

  async clickTiposHora() {
    await this.sidebarLink('Tipos de Hora').click();
    await this.page.waitForURL(/\/tipos-hora/);
  }

  async clickUsuarios() {
    await this.sidebarLink('Usuários').click();
    await this.page.waitForURL(/\/usuarios/);
  }

  /** Verifica se um item do sidebar está presente (permissoes) */
  async isSidebarItemVisible(label: string): Promise<boolean> {
    const link = this.sidebarLink(label);
    return await link.isVisible();
  }

  /** Verifica se um item do sidebar NÃO está presente (sem permissão) */
  async isSidebarItemHidden(label: string): Promise<boolean> {
    const link = this.sidebarLink(label);
    const count = await link.count();
    return count === 0;
  }

  // ── Header ─────────────────────────────────────────────────────────────────

  async getPerfilBadge() {
    return this.page.locator('span.rounded-full').first().textContent();
  }

  async getUserDisplayName() {
    return this.page.locator('aside .text-sm.font-medium.text-white.truncate').first().textContent();
  }

  // ── Notificações ───────────────────────────────────────────────────────────

  async clickNotificationsBell() {
    await this.page.locator('button').filter({ hasText: 'Bell' }).or(
      this.page.locator('button').filter({ has: this.page.locator('[data-icon="bell"]') })
    ).first().click();
  }

  async getUnreadNotificationCount() {
    const badge = this.page.locator('.absolute.-top-0.5.-right-0.5.rounded-full');
    if (await badge.count() === 0) return 0;
    const text = await badge.first().textContent();
    return text === '9+' ? 9 : parseInt(text ?? '0', 10);
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  async clickLogout() {
    await this.page.getByRole('button', { name: 'Sair' }).click();
    await this.page.waitForURL(/\/login/);
  }

  async isLoggedOut() {
    return this.page.url().includes('/login');
  }
}
