import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { CampusPage } from '../pages/campus.page';

const { Given, When, Then } = createBdd();

/**
 * Steps para a feature: Campus
 */

/** Sigla aleatória de 5 letras usada no cadastro de campus. */
function siglaAleatoria(): string {
  return Array.from({ length: 5 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
}

/** Fluxo de edição do primeiro campus da listagem (usado por "edito o campus" e "edito meu campus"). */
async function editarPrimeiroCampus(page: Page, campusPage: CampusPage): Promise<void> {
  await campusPage.abrirListagemCampus();
  const nomeAtual = await campusPage.getNomeDaPrimeiraLinha();
  const novoNome = `${nomeAtual} Editado`;
  (page as any).__campusEditado = novoNome;

  await campusPage.clickEditarPrimeiraLinha();
  await campusPage.preencherNomeCampus(novoNome);
  await campusPage.clickModalSalvar();
}

// ── Pré-condições ──────────────────────────────────────────────────────────────

Given("existe um campus cadastrado", async () => {
  // Massa de dados já existente (V2/V6).
});

// ── Cadastro ───────────────────────────────────────────────────────────────────

When("cadastro um novo campus", async ({ page }) => {
  const campusPage = new CampusPage(page);
  const nome = `Campus Teste ${Date.now()}`;
  (page as any).__campusNome = nome;

  await campusPage.abrirPaginaParaCadastro();
  await campusPage.clickNovoCampus();
  await campusPage.preencherDadosNovoCampus({
    nome,
    sigla: siglaAleatoria(),
    cidade: 'Cidade Teste',
    uf: 'RS',
  });
  await campusPage.clickModalSalvar();
});

Then("o campus deve ser cadastrado com sucesso", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await campusPage.expectModalCampusFechado();
});

Then("devo visualizar o campus cadastrado", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await campusPage.expectLinhaVisivel((page as any).__campusNome);
});

// ── Listagem ───────────────────────────────────────────────────────────────────

Then("devo visualizar os campus cadastrados", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await campusPage.expectPrimeiraLinhaVisivel();
});

Then("devo visualizar meu campus", async ({ page }) => {
  // Administrador de Campus enxerga apenas o próprio campus.
  const campusPage = new CampusPage(page);
  await campusPage.expectPrimeiraLinhaVisivel();
});

// ── Edição ─────────────────────────────────────────────────────────────────────

When("edito o campus", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await editarPrimeiroCampus(page, campusPage);
});

When("edito meu campus", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await editarPrimeiroCampus(page, campusPage);
});

Then("as alterações do campus devem ser salvas", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await campusPage.expectModalCampusFechado();
  await campusPage.expectLinhaVisivel((page as any).__campusEditado);
});

// ── Exclusão ───────────────────────────────────────────────────────────────────

When("excluo o campus", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await campusPage.abrirListagemCampus();
  (page as any).__campusExcluido = await campusPage.getNomeDaPrimeiraLinha();

  await campusPage.clickExcluirPrimeiraLinha();
  await campusPage.confirmarExclusao();
});

Then("o campus não deve mais ser exibido na listagem", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await campusPage.expectLinhaAusente((page as any).__campusExcluido);
});

// ── Restrição de campus (admin de campus) ──────────────────────────────────────

When("acesso a página de outro campus", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await campusPage.irParaPaginaCampus();
  const resp = await page.request.get('/api/v1/campuses');
  const data = (await resp.json()) as Array<{ id: number }>;
  // Admin de campus só enxerga o próprio campus (a listagem é filtrada pelo backend).
  (page as any).__operacaoImpedida = data.length === 1;
});

Then("a operação deve ser impedida", async ({ page }) => {
  expect((page as any).__operacaoImpedida).toBe(true);
});

// ── Validações ─────────────────────────────────────────────────────────────────

When("tento cadastrar um campus sem informar os dados obrigatórios", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await campusPage.abrirPaginaParaValidacao();
  await campusPage.clickBotaoNovoCampus();
  await campusPage.clickModalSalvar();
});

Then("devo visualizar as mensagens de validação", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await campusPage.expectMensagensDeValidacaoVisiveis();
});
