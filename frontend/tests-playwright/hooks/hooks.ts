import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/login.page';
import { LayoutPage } from '../pages/layout.page';

const { Before, After } = createBdd();

/**
 * Hooks — login automático antes de cada cenário, logout após.
 *
 * O playwright-bdd injeta o `page` fixture automaticamente.
 * Não precisamos de World aqui.
 */

Before({ tags: '@not-login' }, async ({ page }) => {
  // Cenários que não precisam de login (ex: página de login em si)
});

Before(async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/login');
  await loginPage.expectOnLoginPage();
});

After(async ({ page }) => {
  const layoutPage = new LayoutPage(page);

  // Só faz logout se já estiver autenticado
  if (!page.url().includes('/login')) {
    try {
      await layoutPage.clickLogout();
      await layoutPage.isLoggedOut();
    } catch {
      // Já está na página de login, ignorar
    }
  }
});
