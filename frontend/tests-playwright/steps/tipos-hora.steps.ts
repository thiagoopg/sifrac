import { createBdd } from 'playwright-bdd';
import type { Page } from '@playwright/test';
import { TiposHoraPage } from '../pages/tipos-hora.page';

const { Given, When, Then } = createBdd();

/**
 * Steps para a feature: Tipos de Hora
 */

/** Fluxo de cadastro de um novo tipo de hora (usado em "cadastro um novo tipo de hora" e "cadastro um tipo de hora para o meu campus"). */
async function cadastrarTipoHora(page: Page, tiposHoraPage: TiposHoraPage, nome: string): Promise<void> {
  (page as any).__tipoNome = nome;

  await tiposHoraPage.abrirPaginaTiposHora();
  await tiposHoraPage.clickBotaoNovoTipo();
  await tiposHoraPage.preencherTipoHora(nome);
  await tiposHoraPage.clickModalSalvar();
}

// ── Pré-condições ──────────────────────────────────────────────────────────────

Given("existe um tipo de hora cadastrado", async () => {
  // pré-condição coberta pelos dados de seed
});

Given("existe um tipo de hora vinculado ao meu campus", async () => {
  // pré-condição coberta pelos dados de seed
});

// ── Listagem ───────────────────────────────────────────────────────────────────

Then("devo visualizar os tipos de hora cadastrados", async ({ page }) => {
  const tiposHoraPage = new TiposHoraPage(page);
  await tiposHoraPage.expectPrimeiraLinhaVisivel();
});

Then("devo visualizar os tipos de hora do meu campus", async ({ page }) => {
  const tiposHoraPage = new TiposHoraPage(page);
  await tiposHoraPage.expectPrimeiraLinhaVisivel();
});

// ── Cadastro ───────────────────────────────────────────────────────────────────

When("cadastro um novo tipo de hora", async ({ page }) => {
  const tiposHoraPage = new TiposHoraPage(page);
  await cadastrarTipoHora(page, tiposHoraPage, `Tipo Teste ${Date.now()}`);
});

When("cadastro um tipo de hora para o meu campus", async ({ page }) => {
  const tiposHoraPage = new TiposHoraPage(page);
  await cadastrarTipoHora(page, tiposHoraPage, `Tipo Campus ${Date.now()}`);
});

Then("o tipo de hora deve ser cadastrado com sucesso", async ({ page }) => {
  const tiposHoraPage = new TiposHoraPage(page);
  await tiposHoraPage.expectModalTipoHoraFechado();
});

Then("devo visualizar o tipo de hora cadastrado", async ({ page }) => {
  const tiposHoraPage = new TiposHoraPage(page);
  await tiposHoraPage.expectLinhaVisivel((page as any).__tipoNome);
});

// ── Edição ─────────────────────────────────────────────────────────────────────

When("edito o tipo de hora", async ({ page }) => {
  const tiposHoraPage = new TiposHoraPage(page);
  await tiposHoraPage.abrirPaginaTiposHora();
  const nomeAtual = await tiposHoraPage.getNomeDaPrimeiraLinha();
  const novoNome = `${nomeAtual} Editado`;
  (page as any).__tipoEditado = novoNome;

  await tiposHoraPage.clickEditarPrimeiraLinha();
  await tiposHoraPage.preencherNomeTipoHora(novoNome);
  await tiposHoraPage.clickModalSalvar();
});

Then("as alterações do tipo de hora devem ser salvas", async ({ page }) => {
  const tiposHoraPage = new TiposHoraPage(page);
  await tiposHoraPage.expectModalTipoHoraFechado();
  await tiposHoraPage.expectLinhaVisivel((page as any).__tipoEditado);
});

// ── Exclusão ───────────────────────────────────────────────────────────────────

When("excluo o tipo de hora", async ({ page }) => {
  const tiposHoraPage = new TiposHoraPage(page);
  await tiposHoraPage.abrirPaginaTiposHora();
  (page as any).__tipoExcluido = await tiposHoraPage.getNomeDaPrimeiraLinha();

  await tiposHoraPage.clickExcluirPrimeiraLinha();
  await tiposHoraPage.confirmarExclusao();
});

Then("o tipo de hora não deve mais ser exibido na listagem", async ({ page }) => {
  const tiposHoraPage = new TiposHoraPage(page);
  await tiposHoraPage.expectLinhaAusente((page as any).__tipoExcluido);
});

// ── Validações ─────────────────────────────────────────────────────────────────

When("tento cadastrar um tipo de hora sem informar os dados obrigatórios", async ({ page }) => {
  const tiposHoraPage = new TiposHoraPage(page);
  await tiposHoraPage.abrirPaginaTiposHora();
  await tiposHoraPage.clickBotaoNovoTipo();
  await tiposHoraPage.clickModalSalvar();
});
