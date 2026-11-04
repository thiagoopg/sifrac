import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * LoginPage — fluxo de autenticação LDAP.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Elementos ──────────────────────────────────────────────────────────────

  private get loginInput() {
    return this.page.getByPlaceholder(/Digite seu login/i);
  }

  private get passwordInput() {
    return this.page.getByPlaceholder(/Digite sua senha/i);
  }

  private get entrarButton() {
    return this.page.getByRole('button', { name: /Entrar/i });
  }

  private get errorMessage() {
    return this.page.locator('.bg-red-50.text-red-600');
  }

  private getUserListItem(nome: string) {
    return this.page.getByRole('button', { name: nome, exact: true }).first();
  }

  // ── Ações ──────────────────────────────────────────────────────────────────

  async fillLogin(login: string) {
    await this.loginInput.fill(login);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /** Login completo (login LDAP + senha). */
  async login(login: string, password: string) {
    await this.fillLogin(login);
    await this.fillPassword(password);
  }

  async clickEntrar() {
    await this.entrarButton.click();
  }

  /** Login usando a lista de usuários rápidos da página */
  async loginWithUser(nome: string) {
    await this.getUserListItem(nome).click();
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  async expectError(message: string) {
    await this.expectVisible(this.errorMessageLocator());
    const text = await this.errorMessage.textContent();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  async expectRedirectToDashboard() {
    await this.page.waitForURL(/\/dashboard/);
  }

  async expectOnLoginPage() {
    await this.page.waitForURL(/\/login/);
  }

  /** Autenticado: a URL saiu da página de login */
  async expectAutenticado() {
    await expect(this.page).not.toHaveURL(/\/login/);
  }

  /** Ainda na página de login (login não concluído) */
  async expectAindaNaPaginaDeLogin() {
    await expect(this.page).toHaveURL(/\/login/);
  }

  /** Mensagem de erro de credenciais inválidas visível */
  async expectMensagemCredenciaisInvalidas() {
    await this.expectErrorBannerVisible();
  }

  errorMessageLocator() {
    return this.page.locator('.bg-red-50.text-red-600');
  }
}
