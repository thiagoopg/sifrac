import { Page, expect } from '@playwright/test';

/**
 * BasePage — classe pai para todos os Page Objects.
 * Centraliza interações comuns (espera por load, waits genéricos).
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navega para o caminho relativo ao baseURL da config */
  async goto(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  /** Navega sem esperas adicionais (mesmo comportamento de page.goto nos steps) */
  async irPara(path: string) {
    await this.page.goto(path);
  }

  /** Primeiro título (h1 por padrão) da página */
  heading(level = 1) {
    return this.page.locator(`h${level}`).first();
  }

  /** Aguarda o título da página ficar visível */
  async expectHeadingVisible(level = 1) {
    await expect(this.heading(level)).toBeVisible();
  }

  /** Banner genérico de erro da aplicação (.bg-red-50.text-red-600) */
  errorBanner() {
    return this.page.locator('.bg-red-50.text-red-600').first();
  }

  /** Aguarda o banner genérico de erro ficar visível */
  async expectErrorBannerVisible() {
    await expect(this.errorBanner()).toBeVisible();
  }

  /** Valida a URL atual da página */
  async expectUrl(pattern: string | RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }

  /** Aguarda a URL atual da página */
  async waitForUrl(pattern: string | RegExp) {
    await this.page.waitForURL(pattern);
  }

  /** Aguarda um elemento aparecer (padrão: 5s) */
  async expectVisible(selector: string | import('@playwright/test').Locator, timeout = 5000) {
    if (typeof selector === 'string') {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
    } else {
      await selector.waitFor({ state: 'visible', timeout });
    }
  }

  /** Aguarda um elemento desaparecer */
  async expectHidden(selector: string | import('@playwright/test').Locator, timeout = 5000) {
    if (typeof selector === 'string') {
      await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
    } else {
      await selector.waitFor({ state: 'hidden', timeout });
    }
  }

  /** Clica e aguarda a navigazione / nova carga de rede */
  async clickAndWait(selector: string, timeout = 30_000) {
    await this.page.locator(selector).click();
    await this.page.waitForLoadState('networkidle', { timeout });
  }
}
