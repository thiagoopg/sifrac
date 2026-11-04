import { createBdd } from 'playwright-bdd';
import { DashboardPage } from '../pages/dashboard.page';

const { Given, When, Then } = createBdd();

/**
 * Steps para a feature: Dashboard
 */

Then("devo visualizar o Dashboard", async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.expectDashboardTitle();
});

Then("devo visualizar as informações disponíveis para o {string}", async ({ page }, arg) => {
  const role = arg as string;
  const dashboard = new DashboardPage(page);

  if (role === 'Aluno') {
    // Aluno vê progresso de horas e solicitações
    await dashboard.expectProgressSection();
  } else {
    // Demais perfis veem cards estatísticos
    await dashboard.expectStatsCards();
    await dashboard.expectRecentTable();
  }
});

Then("devo visualizar o acompanhamento das minhas solicitações", async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.expectProgressSection();
});

Given("existem solicitações cadastradas para o aluno", async () => {
  // pré-condição coberta pelos dados de seed
});
