import { createBdd } from 'playwright-bdd';
import { UsuariosPage } from '../pages/usuarios.page';
import { CampusAdminsPage } from '../pages/campus-admins.page';

const { Given, When, Then } = createBdd();

/**
 * Steps para a feature: Usuários
 */

// ── Listagem / consulta ────────────────────────────────────────────────────────

Then("devo visualizar os usuários cadastrados", async ({ page }) => {
  const usuarios = new UsuariosPage(page);
  await usuarios.expectUsuariosCadastrados();
});

Given("existe um usuário cadastrado", async () => {
  // pré-condição coberta pelos dados de seed
});

Given("existem usuários cadastrados", async () => {
  // pré-condição coberta pelos dados de seed
});

When("acesso os dados do usuário", async ({ page }) => {
  // Não há página de detalhe; a listagem já exibe os dados do usuário.
  const usuarios = new UsuariosPage(page);
  await usuarios.abrirPagina();
  await usuarios.expectUsuariosCadastrados();
});

Then("devo visualizar as informações do usuário", async ({ page }) => {
  const usuarios = new UsuariosPage(page);
  await usuarios.expectInformacoesUsuario();
});

// ── Pesquisa ───────────────────────────────────────────────────────────────────

When("pesquiso por um usuário", async ({ page }) => {
  const usuarios = new UsuariosPage(page);
  await usuarios.abrirPagina();
  const nome = await usuarios.nomePrimeiroUsuario();
  (page as any).__buscaUsuario = nome;
  await usuarios.pesquisar(nome);
});

Then("devo visualizar o usuário correspondente à pesquisa", async ({ page }) => {
  const termo = (page as any).__buscaUsuario as string;
  const usuarios = new UsuariosPage(page);
  await usuarios.expectLinhasContem(termo);
});

// ── Administração de campus (vínculo) ──────────────────────────────────────────
// O passo "acesso a administração de "campus"" é definido em shared.steps.ts
// (rotas para /admin-campus quando o destino é "campus" minúsculo).

Then("devo visualizar os administradores vinculados aos campus", async ({ page }) => {
  const campusAdmins = new CampusAdminsPage(page);
  await campusAdmins.expectAdminsVisiveis();
});

Given("existe um administrador vinculado a um campus", async ({ page }) => {
  // Cria um administrador de campus descartável para não afetar as demais massas.
  const sufixo = Date.now();
  const nome = `Admin Descartavel ${sufixo}`;
  const resp = await page.request.post('/api/v1/usuarios', {
    data: {
      nome,
      email: `admin.teste.${sufixo}@ifrs.edu.br`,
      loginLdap: `admin.teste.${sufixo}`,
      perfil: 'ADMIN_CAMPUS',
      campusId: 1,
    },
  });
  const body = (await resp.json()) as { id: number; nome: string };
  (page as any).__adminVinculadoId = body.id;
  (page as any).__adminVinculadoNome = body.nome ?? nome;
  const campusAdmins = new CampusAdminsPage(page);
  await campusAdmins.abrirPagina();
  await campusAdmins.expectAdminsVisiveis();
});

When("removo o vínculo do administrador com o campus", async ({ page }) => {
  const nome = (page as any).__adminVinculadoNome as string;
  const campusAdmins = new CampusAdminsPage(page);
  await campusAdmins.removerVinculo(nome);
});

Then("o administrador não deve mais estar vinculado ao campus", async ({ page }) => {
  const nome = (page as any).__adminVinculadoNome as string;
  const campusAdmins = new CampusAdminsPage(page);
  await campusAdmins.expectAdminAusente(nome);
});
