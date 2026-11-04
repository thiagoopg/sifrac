import { createBdd } from 'playwright-bdd';
import type { Page } from '@playwright/test';
import { LayoutPage } from '../pages/layout.page';
import { SolicitacoesPage } from '../pages/solicitacoes.page';
import { CampusPage } from '../pages/campus.page';
import { CursosPage } from '../pages/cursos.page';
import { TiposHoraPage } from '../pages/tipos-hora.page';
import { UsuariosPage } from '../pages/usuarios.page';
import { AlunosPage } from '../pages/alunos.page';

const { Given, When, Then } = createBdd();

/**
 * Steps para a feature: Autorização
 */

/** Navega (sem esperas de elemento) para a página do destino usando o Page Object correspondente. */
async function irParaDestino(page: Page, destino: string) {
  switch (destino) {
    case 'Campus':
    case 'campus':
      await new CampusPage(page).irParaPaginaCampus();
      break;
    case 'Cursos':
    case 'cursos':
      await new CursosPage(page).irPara('/cursos');
      break;
    case 'Tipos de Hora':
      await new TiposHoraPage(page).irPara('/tipos-hora');
      break;
    case 'Usuários':
    case 'usuários':
      await new UsuariosPage(page).irPara('/usuarios');
      break;
    case 'Alunos':
    case 'alunos':
      await new AlunosPage(page).irPara('/alunos');
      break;
    default:
      throw new Error(`Destino não mapeado: ${destino}`);
  }
}

Then("devo ter acesso à funcionalidade", async ({ page }) => {
  // Página carregada sem redirecionamento de acesso negado
  const layoutPage = new LayoutPage(page);
  await layoutPage.expectHeadingVisible();
});

Then("devo poder editar um campus diferente do meu", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await campusPage.expectBotaoEditarVisivel();
});

Then("devo poder editar o meu campus", async ({ page }) => {
  const campusPage = new CampusPage(page);
  await campusPage.expectBotaoEditarVisivel();
});

Then("devo visualizar a opção de avaliação", async ({ page }) => {
  const solicitacoesPage = new SolicitacoesPage(page);
  await solicitacoesPage.expectAvaliarButtonsVisible();
});

When("tento acessar a funcionalidade de {string}", async ({ page }, arg) => {
  await irParaDestino(page, arg as string);
});

When("tento acessar a administração de {string}", async ({ page }, arg) => {
  await irParaDestino(page, arg as string);
});

Given("existem diferentes campus cadastrados", async () => {
  // pré-condição coberta pelos dados de seed
});

Given("existe um campus ao qual não estou vinculado", async () => {
  // pré-condição coberta pelos dados de seed
});

When("tento editar esse campus", async ({ page }) => {
  const resp = await page.request.get('/api/v1/campuses');
  const list = (await resp.json()) as Array<{ id: number }>;
  const alheio = (list[0]?.id ?? 0) + 9999;
  const put = await page.request.put(`/api/v1/campuses/${alheio}`, {
    data: { nome: 'Campus Indevido', sigla: 'IND', cidade: 'Cidade', uf: 'RS' },
  });
  (page as any).__operacaoImpedida = !put.ok();
});

Then("o acesso deve ser negado", async ({ page }) => {
  // Rotas restritas redirecionam para uma página permitida (Dashboard) ou login.
  const layoutPage = new LayoutPage(page);
  await layoutPage.expectUrl(/\/(dashboard|login)/);
});

When("tento acessar o gerenciamento de {string}", async ({ page }, arg) => {
  await irParaDestino(page, arg as string);
});

When("acesso a solicitação", async ({ page }) => {
  // Vai para a página de solicitações
  const layoutPage = new LayoutPage(page);
  await layoutPage.clickSolicitacoes();
});

Then("devo ser direcionado para uma página permitida ao meu perfil", async ({ page }) => {
  // Aluno deve cair no dashboard após tentativas de acesso bloqueado
  const layoutPage = new LayoutPage(page);
  await layoutPage.expectUrl(/\/(dashboard|login)/);
});

Then("não devo ter acesso a essa funcionalidade", async ({ page }) => {
  const layoutPage = new LayoutPage(page);
  await layoutPage.expectErrorBannerVisible();
});

Then("devo ter acesso às funcionalidades disponíveis", async ({ page }) => {
  const layoutPage = new LayoutPage(page);
  await layoutPage.expectHeadingVisible();
});
