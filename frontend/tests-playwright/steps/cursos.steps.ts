import { createBdd } from 'playwright-bdd';
import type { Page } from '@playwright/test';
import { CursosPage } from '../pages/cursos.page';

const { Given, When, Then } = createBdd();

/**
 * Steps para a feature: Cursos
 */

/** Fluxo de cadastro de um novo curso (usado em "cadastro um novo curso" e "cadastro um curso para o meu campus"). */
async function cadastrarCurso(page: Page, cursosPage: CursosPage, nome: string): Promise<void> {
  (page as any).__cursoNome = nome;

  await cursosPage.abrirPaginaCursos();
  await cursosPage.clickNovoCurso();
  await cursosPage.preencherNovoCurso(nome);
  await cursosPage.clickModalSalvar();
}

// ── Pré-condições ──────────────────────────────────────────────────────────────

Given("existe um curso cadastrado", async () => {
  // pré-condição coberta pelos dados de seed
});

Given("existe um curso vinculado ao meu campus", async () => {
  // pré-condição coberta pelos dados de seed
});

// ── Listagem ───────────────────────────────────────────────────────────────────

Then("devo visualizar os cursos cadastrados", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cursosPage.expectPrimeiraLinhaVisivel();
});

Then("devo visualizar os cursos do meu campus", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cursosPage.expectPrimeiraLinhaVisivel();
});

Then("devo visualizar os cursos disponíveis", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cursosPage.expectPrimeiraLinhaVisivel();
});

// ── Cadastro ───────────────────────────────────────────────────────────────────

When("cadastro um novo curso", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cadastrarCurso(page, cursosPage, `Curso Teste ${Date.now()}`);
});

When("cadastro um curso para o meu campus", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cadastrarCurso(page, cursosPage, `Curso Campus ${Date.now()}`);
});

Then("o curso deve ser cadastrado com sucesso", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cursosPage.expectModalCursoFechado();
});

Then("devo visualizar o curso cadastrado", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cursosPage.expectLinhaVisivel((page as any).__cursoNome);
});

// ── Edição ─────────────────────────────────────────────────────────────────────

When("edito o curso", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cursosPage.abrirPaginaCursos();
  const nomeAtual = await cursosPage.getNomeDaPrimeiraLinha();
  const novoNome = `${nomeAtual} Editado`;
  (page as any).__cursoEditado = novoNome;

  await cursosPage.clickEditarPrimeiraLinha();
  await cursosPage.preencherNomeCurso(novoNome);
  await cursosPage.clickModalSalvar();
});

Then("as alterações do curso devem ser salvas", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cursosPage.expectModalCursoFechado();
  await cursosPage.expectLinhaVisivel((page as any).__cursoEditado);
});

// ── Exclusão ───────────────────────────────────────────────────────────────────

When("excluo o curso", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cursosPage.abrirPaginaCursos();
  (page as any).__cursoExcluido = await cursosPage.getNomeDaPrimeiraLinha();

  await cursosPage.clickExcluirPrimeiraLinha();
  await cursosPage.confirmarExclusao();
});

Then("o curso não deve mais ser exibido na listagem", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cursosPage.expectLinhaAusente((page as any).__cursoExcluido);
});

// ── Validações ─────────────────────────────────────────────────────────────────

When("tento cadastrar um curso sem informar os dados obrigatórios", async ({ page }) => {
  const cursosPage = new CursosPage(page);
  await cursosPage.abrirPaginaCursos();
  await cursosPage.clickNovoCurso();
  await cursosPage.clickModalSalvar();
});
