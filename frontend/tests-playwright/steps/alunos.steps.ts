import { createBdd } from 'playwright-bdd';
import { AlunosPage } from '../pages/alunos.page';

const { Given, When, Then } = createBdd();

/**
 * Steps para a feature: Alunos
 */

Given("existem alunos cadastrados", async () => {});
Given("existe um aluno cadastrado", async () => {});

Then("devo visualizar os alunos cadastrados", async ({ page }) => {
  const alunos = new AlunosPage(page);
  await alunos.expectAlunosCadastrados();
});

When("acesso os dados do aluno", async ({ page }) => {
  // Não há página de detalhe; os dados já são exibidos na listagem.
  const alunos = new AlunosPage(page);
  await alunos.abrirPagina();
  await alunos.expectAlunosCadastrados();
});

Then("devo visualizar as informações do aluno", async ({ page }) => {
  const alunos = new AlunosPage(page);
  await alunos.expectInformacoesAluno();
});

When("pesquiso por um aluno", async ({ page }) => {
  const alunos = new AlunosPage(page);
  await alunos.abrirPagina();
  const nome = await alunos.nomePrimeiroAluno();
  (page as any).__buscaAluno = nome;
  await alunos.pesquisar(nome);
});

Then("devo visualizar o aluno correspondente à pesquisa", async ({ page }) => {
  const termo = (page as any).__buscaAluno as string;
  const alunos = new AlunosPage(page);
  await alunos.expectLinhasContem(termo);
});
