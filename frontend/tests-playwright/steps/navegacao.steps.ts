import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { LayoutPage } from '../pages/layout.page';

const { Then } = createBdd();

/**
 * Steps para a feature: Navegação pelo sistema
 */

// ── Dado (pré-condições) ──────────────────────────────────────────────────────
// (já cobertos por shared.steps.ts)

// ── Quando (ações de navegação) ───────────────────────────────────────────────
// (já cobertos por shared.steps.ts)

// ── Então (validações de navegação) ──────────────────────────────────────────

Then("devo ser direcionado para a administração de {string}", async ({ page }, arg) => {
  const target = arg as string;

  const routes: Record<string, RegExp> = {
    'Campus': /\/campus/,
    'Cursos': /\/cursos/,
    'Alunos': /\/alunos/,
    'Solicitações': /\/solicitacoes/,
    'Tipos de Hora': /\/tipos-hora/,
    'Usuários': /\/usuarios/,
  };

  const layoutPage = new LayoutPage(page);
  await layoutPage.expectUrl(routes[target]);
});

Then("o acesso não deve ser permitido", async ({ page }) => {
  const layoutPage = new LayoutPage(page);
  await layoutPage.expectUrl(/\/dashboard/);
});

Then("não devo visualizar a opção de Administração de Campus", async ({ page }) => {
  // Não há menu "Administração de Campus", apenas "Campus"
  // Verifica se o item "Campus" não é visível para aluno (aluno não vê Campus)
  const layoutPage = new LayoutPage(page);
  const campusHidden = await layoutPage.isSidebarItemHidden('Campus');
  await expect(campusHidden).toBe(true);
});

Then("devo visualizar as opções de {string}", async ({ page }, arg) => {
  const label = arg as string;
  const layoutPage = new LayoutPage(page);
  const visible = await layoutPage.isSidebarItemVisible(label);
  await expect(visible).toBe(true);
});

Then("não devo visualizar a opção de {string}", async ({ page }, arg) => {
  const label = arg as string;
  const layoutPage = new LayoutPage(page);
  const hidden = await layoutPage.isSidebarItemHidden(label);
  await expect(hidden).toBe(true);
});

Then("devo visualizar a opção de {string}", async ({ page }, arg) => {
  const label = arg as string;
  const layoutPage = new LayoutPage(page);
  const visible = await layoutPage.isSidebarItemVisible(label);
  await expect(visible).toBe(true);
});
