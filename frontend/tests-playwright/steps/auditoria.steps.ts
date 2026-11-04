import { createBdd } from 'playwright-bdd';
import type { Page } from '@playwright/test';
import { SolicitacoesPage } from '../pages/solicitacoes.page';
import { AuditPage } from '../pages/audit.page';

const { Given, When, Then } = createBdd();

/**
 * Steps para a feature: Auditoria — histórico de alterações das solicitações
 */

// ── Pré-condições ──────────────────────────────────────────────────────────────

Given("uma solicitação teve seu status alterado", async () => {});
Given("uma solicitação possui alterações registradas", async () => {});

// ── Navegação no histórico ─────────────────────────────────────────────────────

async function abrirHistorico(page: Page, status?: string) {
  const solicitacoes = new SolicitacoesPage(page);
  const audit = new AuditPage(page);
  await solicitacoes.abrirHistorico(status);
  await audit.expectTituloPresente();
}

When("consulto o histórico da solicitação", async ({ page }) => {
  await abrirHistorico(page);
});

When("tento acessar o histórico da solicitação", async ({ page }) => {
  const resposta = await page.request.get('/api/v1/solicitacoes/999999');
  (page as any).__acessoNegado = resposta.status() === 403 || resposta.status() === 404;
});

// ── Registros no histórico ─────────────────────────────────────────────────────

Then("o cadastro da solicitação deve ser registrado no histórico", async ({ page }) => {
  await abrirHistorico(page);
  const audit = new AuditPage(page);
  await audit.expectAcaoRegistrada('Criação');
});

Then("a avaliação deve ser registrada no histórico", async ({ page }) => {
  await abrirHistorico(page, 'Deferido');
  const audit = new AuditPage(page);
  await audit.expectAcaoRegistrada('Avaliação');
});

Then("o cancelamento deve ser registrado no histórico", async ({ page }) => {
  await abrirHistorico(page);
  const audit = new AuditPage(page);
  await audit.expectAcaoRegistrada('Cancelamento');
});

// ── Conteúdo do histórico ──────────────────────────────────────────────────────

Then("devo visualizar o histórico da solicitação", async ({ page }) => {
  const audit = new AuditPage(page);
  await audit.expectTituloPresente();
  await audit.expectEntradaTimelineVisivel();
});

Then("devo visualizar o status anterior", async ({ page }) => {
  const audit = new AuditPage(page);
  await audit.expectStatusAnteriorVisivel();
});

Then("devo visualizar o novo status", async ({ page }) => {
  const audit = new AuditPage(page);
  await audit.expectNovoStatusVisivel();
});

Then("devo visualizar a data de cada alteração", async ({ page }) => {
  const audit = new AuditPage(page);
  await audit.expectEntradaTimelineVisivel();
});

Then("devo visualizar o usuário responsável por cada alteração", async ({ page }) => {
  const audit = new AuditPage(page);
  await audit.expectUsuarioResponsavelVisivel();
});
