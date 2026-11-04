import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/login.page';
import { LayoutPage } from '../pages/layout.page';
import { DashboardPage } from '../pages/dashboard.page';
import { CampusAdminsPage } from '../pages/campus-admins.page';

const { Given, When, Then } = createBdd();

/**
 * Steps compartilhados — login, logout, navegação, validações genéricas.
 */

// ── Autenticação ───────────────────────────────────────────────────────────────

Given("que estou na página de login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.irPara('/login');
  await loginPage.expectOnLoginPage();
});

// Credenciais dos usuários de teste (LDAP de desenvolvimento).
const CREDENCIAIS: Record<string, { login: string; senha: string }> = {
  'Administrador': { login: 'admin', senha: 'senha123' },
  'Administrador de Campus': { login: 'coordpoa', senha: 'senha12345' },
  'Coordenador': { login: 'marceloschmitt', senha: 'marceloschmitt' },
  'Aluno': { login: 'thiagolima', senha: 'senha12345' },
};

Given("que estou autenticado como {string}", async ({ page }, arg) => {
  const role = arg as string;
  const loginPage = new LoginPage(page);
  const cred = CREDENCIAIS[role];

  await loginPage.irPara('/login');
  await loginPage.login(cred.login, cred.senha);
  await loginPage.clickEntrar();
  await loginPage.expectRedirectToDashboard();
});

Given("que estou autenticado no sistema", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.irPara('/login');
  await loginPage.login('admin', 'senha123');
  await loginPage.clickEntrar();
  await loginPage.expectRedirectToDashboard();
});

Given("que informo o usuário {string}", async ({ page }, arg) => {
  const username = arg as string;
  const loginPage = new LoginPage(page);
  await loginPage.fillLogin(username);
});

Given("que informo a senha válida do {string}", async ({ page }, arg) => {
  const role = arg as string;
  const loginPage = new LoginPage(page);
  await loginPage.fillPassword(CREDENCIAIS[role].senha);
});

Given("que informo credenciais inválidas", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.fillLogin('invalido');
  await loginPage.clickEntrar();
});

// Variantes sem o "que" (usadas em autenticacao.feature).
Given("informo o usuário {string}", async ({ page }, arg) => {
  const loginPage = new LoginPage(page);
  await loginPage.fillLogin(arg as string);
});

Given("informo a senha válida do {string}", async ({ page }, arg) => {
  const loginPage = new LoginPage(page);
  await loginPage.fillPassword(CREDENCIAIS[arg as string].senha);
});

Given("informo credenciais inválidas", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.fillLogin('invalido');
  await loginPage.fillPassword('senha-invalida');
});

Given("confirmo o login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.clickEntrar();
});

Given("encerro a sessão", async ({ page }) => {
  const layoutPage = new LayoutPage(page);
  await layoutPage.clickLogout();
  await layoutPage.isLoggedOut();
});

Given("não devo mais estar autenticado", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.expectAindaNaPaginaDeLogin();
});

// ── Navegação ──────────────────────────────────────────────────────────────────

When("seleciono a opção {string}", async ({ page }, arg) => {
  const label = arg as string;
  const layoutPage = new LayoutPage(page);

  switch (label) {
    case 'Dashboard':
      await layoutPage.clickDashboard();
      break;
    case 'Campus':
      await layoutPage.clickCampus();
      break;
    case 'Cursos':
      await layoutPage.clickCursos();
      break;
    case 'Alunos':
      await layoutPage.clickAlunos();
      break;
    case 'Solicitações':
      await layoutPage.clickSolicitacoes();
      break;
    case 'Tipos de Hora':
      await layoutPage.clickTiposHora();
      break;
    case 'Usuários':
      await layoutPage.clickUsuarios();
      break;
    default:
      throw new Error(`Opção de menu não mapeada: ${label}`);
  }
});

// ── Navegação pelo texto "acesso ..." ─────────────────────────────────────────

When("acesso o sistema", async () => {
  // Já autenticado e no Dashboard (redirect pós-login)
});

When("acesso o Dashboard", async ({ page }) => {
  const layoutPage = new LayoutPage(page);
  await layoutPage.clickDashboard();
});

When("acesso as Solicitações", async ({ page }) => {
  const layoutPage = new LayoutPage(page);
  await layoutPage.clickSolicitacoes();
});

/**
 * "acesso a administração de X":
 * - "campus" (minúsculo) = página de vínculo de administradores (/admin-campus);
 * - demais valores = item correspondente do menu lateral.
 */
When("acesso a administração de {string}", async ({ page }, arg) => {
  const destino = arg as string;

  if (destino === 'campus') {
    const campusAdminsPage = new CampusAdminsPage(page);
    await campusAdminsPage.abrirPagina();
    return;
  }

  const layoutPage = new LayoutPage(page);

  switch (destino) {
    case 'Campus':
      await layoutPage.clickCampus();
      break;
    case 'Cursos':
      await layoutPage.clickCursos();
      break;
    case 'Alunos':
      await layoutPage.clickAlunos();
      break;
    case 'Solicitações':
      await layoutPage.clickSolicitacoes();
      break;
    case 'Tipos de Hora':
      await layoutPage.clickTiposHora();
      break;
    case 'Usuários':
      await layoutPage.clickUsuarios();
      break;
    default:
      throw new Error(`Administração não mapeada: ${destino}`);
  }
});

When("acesso o gerenciamento de {string}", async ({ page }, arg) => {
  const destino = (arg as string).toLowerCase();
  const layoutPage = new LayoutPage(page);

  switch (destino) {
    case 'campus':
      await layoutPage.clickCampus();
      break;
    case 'cursos':
      await layoutPage.clickCursos();
      break;
    case 'alunos':
      await layoutPage.clickAlunos();
      break;
    case 'solicitações':
      await layoutPage.clickSolicitacoes();
      break;
    case 'tipos de hora':
      await layoutPage.clickTiposHora();
      break;
    case 'usuários':
      await layoutPage.clickUsuarios();
      break;
    default:
      throw new Error(`Gerenciamento não mapeado: ${destino}`);
  }
});

// ── Assertions genéricas ───────────────────────────────────────────────────────

Then("devo ser autenticado com sucesso", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.expectAutenticado();
});

Then("devo ser direcionado para o Dashboard", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.expectRedirectToDashboard();
});

Then("devo permanecer na página de login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.expectOnLoginPage();
});

Then("não devo ser autenticado", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.expectAindaNaPaginaDeLogin();
});

Then("devo visualizar uma mensagem informando que as credenciais são inválidas", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.expectMensagemCredenciaisInvalidas();
});

Then("devo visualizar a opção {string} no menu", async ({ page }, arg) => {
  const label = arg as string;
  const layoutPage = new LayoutPage(page);
  const visible = await layoutPage.isSidebarItemVisible(label);
  if (!visible) throw new Error(`Opção de menu não visível: ${label}`);
});

Then("não devo visualizar a opção {string} no menu", async ({ page }, arg) => {
  const label = arg as string;
  const layoutPage = new LayoutPage(page);
  const hidden = await layoutPage.isSidebarItemHidden(label);
  if (!hidden) throw new Error(`Opção de menu visível sem permissão: ${label}`);
});

// ── Navegação pelo menu ────────────────────────────────────────────────────────

Given("estou em uma funcionalidade diferente do Dashboard", async ({ page }) => {
  const layoutPage = new LayoutPage(page);
  await layoutPage.clickSolicitacoes();
});

Then("devo ser direcionado para as Solicitações", async ({ page }) => {
  const layoutPage = new LayoutPage(page);
  await layoutPage.expectUrl(/\/solicitacoes/);
});

When("seleciono a opção de encerramento da sessão", async ({ page }) => {
  const layoutPage = new LayoutPage(page);
  await layoutPage.clickLogout();
});

Then("devo ser direcionado para a página de login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.expectOnLoginPage();
});

// ── Validação genérica de cadastro ─────────────────────────────────────────────

Then("o cadastro não deve ser realizado", async ({ page }) => {
  const layoutPage = new LayoutPage(page);
  await layoutPage.expectErrorBannerVisible();
});

// ── Sessão encerrada / página protegida ────────────────────────────────────────

When("tento acessar uma página protegida", async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.irPara('/dashboard');
});
