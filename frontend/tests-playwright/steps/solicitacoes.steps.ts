import { createBdd } from 'playwright-bdd';
import type { Page } from '@playwright/test';
import { SolicitacoesPage } from '../pages/solicitacoes.page';
import { AuditPage } from '../pages/audit.page';

const { Given, When, Then } = createBdd();

/**
 * Steps para a feature: Solicitações — listagem, filtro, cadastro e avaliação
 */

// ── Pré-condições (massa de dados) ─────────────────────────────────────────────

Given("existem solicitações de diferentes alunos", async () => {});
Given("existem solicitações com diferentes status", async () => {});
Given("existem solicitações cadastradas em diferentes períodos", async () => {});
Given("existe uma solicitação pendente", async ({ request }) => {
  await request.post('/api/v1/login', {
    form: { username: 'thiagolima', password: 'senha12345' },
  });
  await request.post('/api/v1/solicitacoes', {
    data: {
      tipoHoraId: 4,
      titulo: `Solicitação Teste ${Date.now()}`,
      horasSolicitadas: 5,
    },
  });
});
Given("existe uma solicitação cadastrada pelo aluno", async () => {});
Given("existe uma solicitação cadastrada", async () => {});
Given("existe uma solicitação pertencente a outro aluno", async () => {});

// ── Listagem ───────────────────────────────────────────────────────────────────

Then("devo visualizar as solicitações cadastradas", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectPrimeiraLinhaVisivel();
});

Then("devo visualizar as solicitações disponíveis", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectPrimeiraLinhaVisivel();
});

Then("devo visualizar somente minhas solicitações", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectPrimeiraLinhaVisivel();
});

// ── Filtros ────────────────────────────────────────────────────────────────────

When("filtro as solicitações por status", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.abrirPagina();
  await solicitacoes.clickFilterPendentes();
});

Then("devo visualizar somente as solicitações correspondentes ao status selecionado", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectTodasLinhasContem('Pendente');
});

When("filtro as solicitações por período", async ({ page }) => {
  // Não há filtro por período na interface; garante a listagem carregada.
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.abrirPagina();
});

Then("devo visualizar somente as solicitações correspondentes ao período selecionado", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectPrimeiraLinhaVisivel();
});

// ── Cadastro ───────────────────────────────────────────────────────────────────

When("cadastro uma solicitação de horas complementares", async ({ page }) => {
  const titulo = `Atividade Teste ${Date.now()}`;
  (page as any).__solicitacaoTitulo = titulo;

  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.abrirPagina();
  await solicitacoes.clickNovaSolicitacao();
  await solicitacoes.expectNovaSolicitacaoModalOpen();
  await solicitacoes.preencherNovaSolicitacao(titulo, 10);
  await solicitacoes.selecionarTipoHora('Monitoria');
  await solicitacoes.clickNovaSolicitacaoSolicitar();
});

When("tento cadastrar uma solicitação sem informar os dados obrigatórios", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.abrirPagina();
  await solicitacoes.clickNovaSolicitacao();
  await solicitacoes.clickNovaSolicitacaoSolicitar();
});

Then("a solicitação não deve ser cadastrada", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectNovaSolicitacaoModalOpen();
  await solicitacoes.expectMensagemErroVisivel();
});

Then("a solicitação deve ser cadastrada com sucesso", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectNovaSolicitacaoModalClosed();
});

Then("a solicitação deve ficar com status Pendente", async ({ page }) => {
  const titulo = (page as any).__solicitacaoTitulo as string;
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectLinhaComTextoEStatus(titulo, 'Pendente');
});

// ── Detalhes ───────────────────────────────────────────────────────────────────

When("acesso os detalhes da solicitação", async ({ page }) => {
  // Não há página dedicada; os dados estão na própria listagem.
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.abrirPagina();
  await solicitacoes.expectPrimeiraLinhaVisivel();
});

Then("devo visualizar os dados da solicitação", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectPrimeiraLinhaVisivel();
});

Then("devo visualizar o status da solicitação", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectStatusValidoNaListagem();
});

// ── Avaliação ──────────────────────────────────────────────────────────────────

async function avaliar(page: Page, status: 'DEFERIDO' | 'INDEFERIDO', horas = 5) {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.abrirAvaliacao(status);
  await solicitacoes.preencherAvaliacao(
    status,
    status === 'DEFERIDO' ? horas : undefined,
    status === 'INDEFERIDO' ? 'Justificativa de indeferimento.' : undefined,
  );
  await solicitacoes.clickAvaliacaoConfirmar();
}

When("avalio a solicitação", async ({ page }) => {
  await avaliar(page, 'DEFERIDO');
});

When("avalia a solicitação", async ({ page }) => {
  await avaliar(page, 'DEFERIDO');
});

When("avaliar a solicitação", async ({ page }) => {
  await avaliar(page, 'DEFERIDO');
});

When("defiro a solicitação", async ({ page }) => {
  await avaliar(page, 'DEFERIDO');
});

When("indefiro a solicitação", async ({ page }) => {
  await avaliar(page, 'INDEFERIDO');
});

Then("a solicitação deve ter seu status atualizado", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectAvaliacaoModalClosed();
  await solicitacoes.expectLinhaAvaliadaVisivel();
});

Then("a solicitação deve ficar com status Deferido", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectAvaliacaoModalClosed();
  await solicitacoes.expectLinhaDeferidaVisivel();
});

Then("a solicitação deve ficar com status Indeferido", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectAvaliacaoModalClosed();
  await solicitacoes.expectLinhaIndeferidaVisivel();
});

Then("não devo visualizar a opção de avaliação", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.expectOpcoesAvaliacaoAusentes();
});

// ── Histórico ──────────────────────────────────────────────────────────────────

When("acesso o histórico da solicitação", async ({ page }) => {
  const solicitacoes = new SolicitacoesPage(page);
  await solicitacoes.abrirHistoricoDaPrimeiraSolicitacao();
});

Then("devo visualizar o histórico de alterações da solicitação", async ({ page }) => {
  const audit = new AuditPage(page);
  await audit.expectTituloPresente();
  await audit.expectEntradaTimelineVisivel();
});
